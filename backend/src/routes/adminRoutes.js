const express = require('express');
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserStatus,
  getMenuItemsAdmin,
  getRevenueAnalytics,
} = require('../controllers/adminController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Apply admin check middleware to all routes
router.use(authenticateUser, authorizeRole(['admin']));

router.get('/dashboard/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/menu-items', getMenuItemsAdmin);
router.get('/analytics/revenue', getRevenueAnalytics);

module.exports = router;
