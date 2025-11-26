const pool = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Total orders
    const [[{ total_orders }]] = await connection.query('SELECT COUNT(*) as total_orders FROM orders');

    // Revenue
    const [[{ revenue = 0 }]] = await connection.query('SELECT SUM(total_amount) as revenue FROM orders WHERE status = "delivered"');

    // Pending orders
    const [[{ pending_orders }]] = await connection.query('SELECT COUNT(*) as pending_orders FROM orders WHERE status = "pending"');

    // Total users
    const [[{ total_users }]] = await connection.query('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');

    connection.release();

    res.json({
      success: true,
      stats: {
        total_orders,
        revenue: parseFloat(revenue) || 0,
        pending_orders,
        total_users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT o.*, u.first_name, u.last_name, u.email FROM orders o JOIN users u ON o.user_id = u.id';
    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();
    const [orders] = await connection.query(query, params);

    const countQuery = status ? 'SELECT COUNT(*) as total FROM orders WHERE status = ?' : 'SELECT COUNT(*) as total FROM orders';
    const countParams = status ? [status] : [];
    const [[{ total }]] = await connection.query(countQuery, countParams);

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

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const connection = await pool.getConnection();

    // Get previous order and user id for notification
    const [[orderBefore]] = await connection.query('SELECT id, user_id, status FROM orders WHERE id = ?', [id]);
    if (!orderBefore) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    // Log admin action with old and new value
    await connection.query(
      'INSERT INTO admin_logs (admin_id, action, description, table_name, record_id, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        req.user.id,
        'UPDATE_ORDER_STATUS',
        `Order status updated from ${orderBefore.status} to ${status}`,
        'orders',
        id,
        JSON.stringify({ status: orderBefore.status }),
        JSON.stringify({ status }),
      ]
    );

    connection.release();

    // Emit Socket.IO event to user and admin rooms
    try {
      const io = req.app.get('io');
      if (io) {
        const payload = { orderId: parseInt(id), status, updatedBy: req.user.id, updatedAt: new Date().toISOString() };
        // notify specific user
        io.to(`user-${orderBefore.user_id}`).emit('order_status_updated', payload);
        // notify admins
        io.to('admin-room').emit('order_status_updated', payload);
      }
    } catch (e) {
      // don't fail the request if sockets aren't available
      console.warn('Socket emit failed', e);
    }

    return res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Admin - Get all users (paste above module.exports)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, first_name, last_name, email, phone, created_at, is_active FROM users WHERE role = "user" LIMIT ? OFFSET ?',
      [parseInt(limit, 10), offset]
    );

    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    connection.release();

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Block/Unblock user
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    const [users] = await connection.query('SELECT is_active FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = !users[0].is_active;
    await connection.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);

    connection.release();

    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'blocked'} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get menu items for admin
const getMenuItemsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    const [items] = await connection.query(
      'SELECT m.*, c.name as category_name FROM menu_items m JOIN categories c ON m.category_id = c.id LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );

    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM menu_items');
    connection.release();

    res.json({
      success: true,
      items,
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

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const connection = await pool.getConnection();

    const [data] = await connection.query(
      `SELECT DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as orders 
       FROM orders 
       WHERE status = "delivered" AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [days]
    );

    connection.release();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserStatus,
  getMenuItemsAdmin,
  getRevenueAnalytics,
};
