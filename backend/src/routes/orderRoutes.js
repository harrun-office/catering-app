const express = require('express');
const { createOrder, getUserOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateUser, createOrder);
router.get('/', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrderById);
router.put('/:id/cancel', authenticateUser, cancelOrder);

module.exports = router;
