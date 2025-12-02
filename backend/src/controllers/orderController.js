const pool = require('../config/database');
const { validateOrder } = require('../utils/validators');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items: rawItems, delivery_date, delivery_time, delivery_address, notes } = req.body;

    // Debug: log incoming items structure when troubleshooting order failures
    console.debug && console.debug('createOrder incoming rawItems:', JSON.stringify(rawItems));
    console.debug && console.debug('createOrder full payload:', JSON.stringify(req.body));

    // Basic validation & sanitization: map raw items into normalized shape
    const items = Array.isArray(rawItems)
      ? rawItems.map((it) => ({
          menu_item_id: it?.menu_item_id !== undefined ? Number(it.menu_item_id) : Number(it?.id),
          quantity: it?.quantity !== undefined ? Number(it.quantity) : Number(it?.qty),
          special_instructions: it?.special_instructions || null,
        }))
      : [];

    // === NEW: Early numeric validation for menu_item_id and quantity ===
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    for (const [idx, it] of items.entries()) {
      if (!Number.isFinite(it.menu_item_id) || it.menu_item_id <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid menu_item_id for item at index ${idx}: ${JSON.stringify(rawItems?.[idx] ?? it)}`,
        });
      }
      if (!Number.isFinite(it.quantity) || it.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item with menu_item_id ${it.menu_item_id} at index ${idx}`,
        });
      }
    }
    // === END NEW VALIDATION ===

    const errors = validateOrder({ items, delivery_date, delivery_address });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Calculate totals
      let subtotal = 0;
      const itemDetails = [];

      for (const item of items) {
        // fetch price and validate existence
        const [menuItems] = await connection.query('SELECT price FROM menu_items WHERE id = ?', [item.menu_item_id]);

        if (menuItems.length === 0) {
          // return a clear client error for invalid item
          await connection.rollback();
          connection.release();
          return res.status(400).json({ success: false, message: `Menu item not found: ${item.menu_item_id}` });
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

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, order_number, subtotal, tax, delivery_charge, total_amount, delivery_address, delivery_date, delivery_time, notes, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, orderNumber, subtotal, tax, deliveryCharge, totalAmount, delivery_address, delivery_date, delivery_time, notes, 'pending', 'pending']
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of itemDetails) {
        await connection.query(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, item.unit_price, item.total_price, item.special_instructions]
        );
      }

      await connection.commit();

      res.status(201).json({
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
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    // Log payload + error to help debug malformed requests that reach the catch
    console.error('createOrder failed. payload:', {
      body: req.body,
      user: req.user?.id,
    });
    console.error('createOrder error:', error && (error.stack || error.message || error));

    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

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

    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [req.user.id]);
    connection.release();

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
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
    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
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

    const [orders] = await connection.query('SELECT status FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orders[0].status !== 'pending' && orders[0].status !== 'confirmed') {
      connection.release();
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    await connection.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
    connection.release();

    res.json({ success: true, message: 'Order cancelled successfully' });
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
};
