const pool = require('../config/database');
const { validateOrder } = require('../utils/validators');

// Helper: normalize delivery_time to MySQL TIME format ("HH:MM:SS")
function normalizeTimeToMySQL(timeStr) {
  if (!timeStr) return null; // or make this required if your schema needs it

  const t = String(timeStr).trim();

  // Case 1: 24h "HH:MM" or "HH:MM:SS"
  const twentyFourHourMatch = /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(t);
  if (twentyFourHourMatch) {
    const hh = twentyFourHourMatch[1].padStart(2, '0');
    const mm = twentyFourHourMatch[2].padStart(2, '0');
    const ss = (twentyFourHourMatch[3] || '00').padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  // Case 2: 12h format "h:mm AM/PM" or "hh:mm am/pm"
  const twelveHourMatch = /^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i.exec(t);
  if (twelveHourMatch) {
    let hour = parseInt(twelveHourMatch[1], 10);
    const minute = twelveHourMatch[2];
    const ampm = twelveHourMatch[3].toUpperCase();

    if (hour < 1 || hour > 12) {
      throw new Error(`Invalid 12-hour time hour: ${hour}`);
    }

    if (ampm === 'AM') {
      if (hour === 12) hour = 0;        // 12:xx AM -> 00:xx
    } else if (ampm === 'PM') {
      if (hour !== 12) hour += 12;      // 1-11 PM -> 13-23
    }

    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    return `${hh}:${mm}:00`;
  }

  // If neither format matched, it's invalid
  throw new Error(`Invalid time format: "${timeStr}"`);
}

// Create order
// Assumes:
// - `pool` is a mysql2/promise pool
// - `validateOrder` is imported and works as expected
// - express.json() middleware is enabled globally
const createOrder = async (req, res) => {
  try {
    // Basic safety: ensure body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
      });
    }

    // Auth check: avoids req.user being undefined and throwing
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const {
      items: rawItems,
      delivery_date,
      delivery_time,
      delivery_address,
      notes,
    } = req.body;

    // Debug logs (only in non-production to avoid noise)
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.debug('createOrder incoming rawItems:', JSON.stringify(rawItems));
        console.debug('createOrder full payload:', JSON.stringify(req.body));
      } catch (e) {
        console.warn('Failed to stringify request body for debugging:', e?.message || e);
      }
    }

    // Normalize items
    const items = Array.isArray(rawItems)
      ? rawItems.map((it) => ({
          menu_item_id:
            it?.menu_item_id !== undefined
              ? Number(it.menu_item_id)
              : Number(it?.id),
          quantity:
            it?.quantity !== undefined
              ? Number(it.quantity)
              : Number(it?.qty),
          special_instructions: it?.special_instructions || null,
        }))
      : [];

    // Early validation for items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided',
      });
    }

    for (const [idx, it] of items.entries()) {
      if (!Number.isFinite(it.menu_item_id) || it.menu_item_id <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid menu_item_id for item at index ${idx}: ${JSON.stringify(
            rawItems?.[idx] ?? it
          )}`,
        });
      }
      if (!Number.isFinite(it.quantity) || it.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item with menu_item_id ${it.menu_item_id} at index ${idx}`,
        });
      }
    }

    // Normalize time to MySQL format and catch invalid formats
    let mysqlDeliveryTime = null;
    try {
      mysqlDeliveryTime = normalizeTimeToMySQL(delivery_time);
    } catch (timeError) {
      return res.status(400).json({
        success: false,
        message: timeError.message,
      });
    }

    // Validation wrapper to avoid validateOrder throwing causing 500
    let errors;
    try {
      errors = validateOrder({
        items,
        delivery_date,
        delivery_address,
        delivery_time: mysqlDeliveryTime,
      });
    } catch (e) {
      console.error('validateOrder crashed:', e?.stack || e?.message || e);
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
      });
    }

    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Calculate totals
      let subtotal = 0;
      const itemDetails = [];

      for (const item of items) {
        // Fetch price and validate item existence
        const [menuItems] = await connection.query(
          'SELECT price FROM menu_items WHERE id = ?',
          [item.menu_item_id]
        );

        if (!Array.isArray(menuItems) || menuItems.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({
            success: false,
            message: `Menu item not found: ${item.menu_item_id}`,
          });
        }

        const price = Number(menuItems[0].price) || 0;
        const qty = Number(item.quantity) || 0;
        const itemTotal = price * qty;
        subtotal += itemTotal;

        itemDetails.push({
          menu_item_id: item.menu_item_id,
          quantity: qty,
          special_instructions: item.special_instructions || null,
          unit_price: price,
          total_price: itemTotal,
        });
      }

      const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax
      const deliveryCharge = subtotal > 500 ? 0 : 50; // Free delivery above 500
      const totalAmount = subtotal + tax + deliveryCharge;

      // Generate order number (you can replace with any scheme)
      const orderNumber = `ORD-${Date.now()}`;

      // Insert into orders table
      const [orderResult] = await connection.query(
        `INSERT INTO orders 
          (user_id, order_number, subtotal, tax, delivery_charge, total_amount, 
           delivery_address, delivery_date, delivery_time, notes, status, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          orderNumber,
          subtotal,
          tax,
          deliveryCharge,
          totalAmount,
          delivery_address,
          delivery_date,
          mysqlDeliveryTime,   // ✅ normalized time here
          notes || null,
          'pending',
          'pending',
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of itemDetails) {
        await connection.query(
          `INSERT INTO order_items 
            (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.menu_item_id,
            item.quantity,
            item.unit_price,
            item.total_price,
            item.special_instructions,
          ]
        );
      }

      await connection.commit();
      connection.release();

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: {
          id: orderId,
          order_number: orderNumber,
          subtotal,
          tax,
          delivery_charge: deliveryCharge,
          total_amount: totalAmount,
          status: 'pending',
          items: itemDetails,
        },
      });
    } catch (error) {
      // Inner DB/logic error
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error(
          'Rollback failed:',
          rollbackErr?.stack || rollbackErr?.message || rollbackErr
        );
      }
      connection.release();
      throw error; // bubble up to outer catch
    }
  } catch (error) {
    // Outer catch: any unexpected error ends up here
    console.error('createOrder failed. payload:', {
      body: req.body,
      user: req.user?.id,
    });
    console.error(
      'createOrder error:',
      error && (error.stack || error.message || error)
    );

    // In production keep it generic; in dev you can expose more if you want
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message || 'Server error'
          : 'Server error',
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const connection = await pool.getConnection();
    const [orders] = await connection.query(query, params);

    // Get order items for each order
    for (let order of orders) {
      const [items] = await connection.query(
        `SELECT oi.*, mi.name, mi.image FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    const [[{ total }]] = await connection.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [req.user.id]
    );
    connection.release();

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (orders.length === 0) {
      connection.release();
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    const [items] = await connection.query(
      `SELECT oi.*, mi.name, mi.image FROM order_items oi 
       JOIN menu_items mi ON oi.menu_item_id = mi.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    connection.release();

    res.json({
      success: true,
      order: { ...orders[0], items },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    const [orders] = await connection.query(
      'SELECT status FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (orders.length === 0) {
      connection.release();
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (
      orders[0].status !== 'pending' &&
      orders[0].status !== 'confirmed'
    ) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled',
      });
    }

    await connection.query('UPDATE orders SET status = ? WHERE id = ?', [
      'cancelled',
      id,
    ]);
    connection.release();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get active order for tracking
const getActiveOrder = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Find the most recent order that is NOT delivered or cancelled
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE user_id = ? AND status NOT IN (?, ?) ORDER BY created_at DESC LIMIT 1',
      [req.user.id, 'delivered', 'cancelled']
    );

    if (orders.length === 0) {
      connection.release();
      return res.json({ success: true, order: null });
    }

    const order = orders[0];

    // Get items for this order
    const [items] = await connection.query(
      `SELECT oi.*, mi.name, mi.image FROM order_items oi 
       JOIN menu_items mi ON oi.menu_item_id = mi.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    connection.release();

    res.json({
      success: true,
      order: { ...order, items },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getActiveOrder,
};
