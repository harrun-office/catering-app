const express = require('express');
const { getMenuItems, getMenuItemById, getCategories, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const upload = require('../middleware/upload');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin routes
// Accept image file under field name `image`
router.post('/', authenticateUser, authorizeRole(['admin']), upload.single('image'), createMenuItem);
router.put('/:id', authenticateUser, authorizeRole(['admin']), upload.single('image'), updateMenuItem);
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deleteMenuItem);

module.exports = router;
