const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateUser: protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getUserOrders);
router.get('/active', protect, orderController.getActiveOrder); // New endpoint
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
