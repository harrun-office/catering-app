const express = require('express');
const multer = require('multer');
const { getMenuItems, getMenuItemById, getCategories, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const upload = require('../middleware/upload');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
  }
  next();
};

// Admin routes
// Accept image file under field name `image`
router.post('/', authenticateUser, authorizeRole(['admin']), upload.single('image'), handleMulterError, createMenuItem);
router.put('/:id', authenticateUser, authorizeRole(['admin']), upload.single('image'), handleMulterError, updateMenuItem);
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deleteMenuItem);

module.exports = router;
