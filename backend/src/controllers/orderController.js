const pool = require('../config/database');
const { validateOrder } = require('../utils/validators');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, delivery_date, delivery_time, delivery_address, notes } = req.body;

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
        const [menuItems] = await connection.query('SELECT price FROM menu_items WHERE id = ?', [item.menu_item_id]);

        if (menuItems.length === 0) {
          throw new Error('Invalid menu item');
        }

        const price = menuItems[0].price;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        itemDetails.push({ ...item, unit_price: price, total_price: itemTotal });
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
    console.error(error);
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
