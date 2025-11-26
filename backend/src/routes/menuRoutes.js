const express = require('express');
const { getMenuItems, getMenuItemById, getCategories, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin routes
router.post('/', authenticateUser, authorizeRole(['admin']), createMenuItem);
router.put('/:id', authenticateUser, authorizeRole(['admin']), updateMenuItem);
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deleteMenuItem);

module.exports = router;
