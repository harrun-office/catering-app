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

    // If a file was uploaded, store its public path (uploads/images folder)
    let imagePath = null;
    if (req.file && req.file.filename) {
      imagePath = `/uploads/images/${req.file.filename}`;
    }

    const [result] = await connection.query(
      'INSERT INTO menu_items (category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, imagePath]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item: { id: result.insertId, category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, image: imagePath },
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

    // Load existing item to provide sensible defaults
    const [existingRows] = await connection.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    const existing = existingRows[0];

    // If a new image was uploaded, use it (stored under uploads/images)
    let imagePath = null;
    if (req.file && req.file.filename) {
      imagePath = `/uploads/images/${req.file.filename}`;
      await connection.query('UPDATE menu_items SET image = ? WHERE id = ?', [imagePath, id]);
    }

    // Coerce/normalize incoming values, falling back to existing values where appropriate
    const finalCategoryIdRaw = category_id !== undefined && category_id !== '' ? category_id : existing.category_id;
    const finalCategoryId = finalCategoryIdRaw !== null ? Number(finalCategoryIdRaw) : null;
    const finalName = name !== undefined ? name : existing.name;
    const finalDescription = description !== undefined ? description : existing.description;
    const finalPriceRaw = price !== undefined && price !== '' ? price : existing.price;
    const finalPrice = finalPriceRaw !== null && finalPriceRaw !== '' ? Number(finalPriceRaw) : null;

    // Servings must be an integer or NULL. If incoming value is empty string treat as NULL.
    let finalServings = existing.servings;
    if (servings !== undefined) {
      if (servings === '' || servings === null) {
        finalServings = null;
      } else {
        const n = Number(servings);
        finalServings = Number.isFinite(n) ? n : null;
      }
    }

    const finalPreparationTime = preparation_time !== undefined ? preparation_time : existing.preparation_time;
    const finalIsVegetarian = typeof is_vegetarian !== 'undefined' ? (is_vegetarian === '1' || is_vegetarian === 1 || is_vegetarian === true) ? 1 : 0 : existing.is_vegetarian;
    const finalIsVegan = typeof is_vegan !== 'undefined' ? (is_vegan === '1' || is_vegan === 1 || is_vegan === true) ? 1 : 0 : existing.is_vegan;
    const finalIsGlutenFree = typeof is_gluten_free !== 'undefined' ? (is_gluten_free === '1' || is_gluten_free === 1 || is_gluten_free === true) ? 1 : 0 : existing.is_gluten_free;
    const finalIsAvailable = typeof is_available !== 'undefined' ? (is_available === '1' || is_available === 1 || is_available === true) ? 1 : 0 : existing.is_available;

    await connection.query(
      'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, servings = ?, preparation_time = ?, is_vegetarian = ?, is_vegan = ?, is_gluten_free = ?, is_available = ? WHERE id = ?',
      [finalCategoryId, finalName, finalDescription, finalPrice, finalServings, finalPreparationTime, finalIsVegetarian, finalIsVegan, finalIsGlutenFree, finalIsAvailable, id]
    );
    connection.release();

    res.json({ success: true, message: 'Menu item updated successfully', image: imagePath || undefined });
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
