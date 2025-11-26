const pool = require('../config/database');
const { validateMenuItem } = require('../utils/validators');

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const { category_id, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM menu_items WHERE is_available = TRUE';
    const params = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();
    const [items] = await connection.query(query, params);
    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM menu_items WHERE is_available = TRUE');
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

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [items] = await connection.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    connection.release();

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, item: items[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.query('SELECT id, name, image, description FROM categories WHERE is_active = TRUE');
    connection.release();

    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create menu item (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const { category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free } = req.body;

    const errors = validateMenuItem({ category_id, name, price });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const connection = await pool.getConnection();

    // Check if category exists
    const [categories] = await connection.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const [result] = await connection.query(
      'INSERT INTO menu_items (category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item: { id: result.insertId, ...req.body },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, is_available } = req.body;

    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, servings = ?, preparation_time = ?, is_vegetarian = ?, is_vegan = ?, is_gluten_free = ?, is_available = ? WHERE id = ?',
      [category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, is_available, id]
    );
    connection.release();

    res.json({ success: true, message: 'Menu item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM menu_items WHERE id = ?', [id]);
    connection.release();

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
