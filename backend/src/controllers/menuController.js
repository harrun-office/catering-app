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
  let connection = null;
  try {
    const { category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free } = req.body;

    const errors = validateMenuItem({ category_id, name, price });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    connection = await pool.getConnection();

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

    // preparation_time and servings: treat empty string as NULL (no preparation time)
    const finalPreparationTime = preparation_time === '' || typeof preparation_time === 'undefined' || preparation_time === null ? null : Number(preparation_time);
    const finalServings = servings === '' || typeof servings === 'undefined' || servings === null ? null : Number(servings);

    const [result] = await connection.query(
      'INSERT INTO menu_items (category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, finalServings, finalPreparationTime, is_vegetarian, is_vegan, is_gluten_free, imagePath]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item: { id: result.insertId, category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, image: imagePath },
    });
  } catch (error) {
    if (connection) {
      connection.release();
    }
    console.error('Create menu item error:', error);
    const errorMessage = error.message || 'Server error';
    res.status(500).json({ success: false, message: errorMessage, error: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  let connection = null;
  try {
    const { id } = req.params;
    
    // Always log the request for debugging
    console.log('=== UPDATE MENU ITEM REQUEST ===');
    console.log('ID:', id);
    console.log('req.body:', req.body);
    console.log('req.body type:', typeof req.body);
    console.log('req.body keys:', Object.keys(req.body || {}));
    console.log('req.file:', req.file ? { filename: req.file.filename, size: req.file.size } : 'no file');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Extract fields from req.body - multer should parse FormData fields into req.body
    let { category_id, name, description, price, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, is_available } = req.body || {};
    
    // If req.body is empty or undefined, it might be a parsing issue
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('req.body is empty - FormData might not be parsed correctly');
      return res.status(400).json({ success: false, message: 'Request body is empty. Please ensure all fields are sent correctly.' });
    }

    // Ensure we have a connection
    if (!pool) {
      throw new Error('Database pool not initialized');
    }

    connection = await pool.getConnection();

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
    // category_id is NOT NULL in schema, so ensure we always have a valid value
    let finalCategoryIdRaw = category_id !== undefined && category_id !== '' && category_id !== null ? category_id : existing.category_id;
    if (!finalCategoryIdRaw || finalCategoryIdRaw === '') {
      finalCategoryIdRaw = existing.category_id;
    }
    const finalCategoryId = Number(finalCategoryIdRaw);
    if (!Number.isFinite(finalCategoryId) || finalCategoryId <= 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    // Verify category exists
    const [categoryCheck] = await connection.query('SELECT id FROM categories WHERE id = ?', [finalCategoryId]);
    if (categoryCheck.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Category does not exist' });
    }

    const finalName = name !== undefined && name !== '' ? name : existing.name;
    if (!finalName || finalName.trim().length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const finalDescription = description !== undefined ? description : existing.description;

    // price is NOT NULL in schema, so ensure we always have a valid value
    let finalPriceRaw = price !== undefined && price !== '' && price !== null ? price : existing.price;
    if (finalPriceRaw === null || finalPriceRaw === '' || finalPriceRaw === undefined) {
      finalPriceRaw = existing.price;
    }
    const finalPrice = Number(finalPriceRaw);
    if (!Number.isFinite(finalPrice) || finalPrice < 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Price must be a valid number >= 0' });
    }

    // Servings must be an integer or NULL. If incoming value is empty string treat as NULL.
    let finalServings = existing.servings;
    if (servings !== undefined) {
      if (servings === '' || servings === null || servings === 'null') {
        finalServings = null;
      } else {
        const n = Number(servings);
        finalServings = Number.isFinite(n) && n > 0 ? n : null;
      }
    }

    // Preparation time can be null or a number
    let finalPreparationTime = existing.preparation_time;
    if (preparation_time !== undefined) {
      if (preparation_time === '' || preparation_time === null || preparation_time === 'null') {
        finalPreparationTime = null;
      } else {
        const n = Number(preparation_time);
        finalPreparationTime = Number.isFinite(n) && n > 0 ? n : null;
      }
    }

    // Convert boolean values - handle both string and number inputs from FormData
    // MySQL stores booleans as TINYINT(1), so existing values are 0 or 1
    const existingIsVegetarian = existing.is_vegetarian === 1 || existing.is_vegetarian === true || existing.is_vegetarian === '1';
    const existingIsVegan = existing.is_vegan === 1 || existing.is_vegan === true || existing.is_vegan === '1';
    const existingIsGlutenFree = existing.is_gluten_free === 1 || existing.is_gluten_free === true || existing.is_gluten_free === '1';
    const existingIsAvailable = existing.is_available === 1 || existing.is_available === true || existing.is_available === '1';
    
    const finalIsVegetarian = typeof is_vegetarian !== 'undefined' ? (is_vegetarian === '1' || is_vegetarian === 1 || is_vegetarian === true || is_vegetarian === 'true') ? 1 : 0 : (existingIsVegetarian ? 1 : 0);
    const finalIsVegan = typeof is_vegan !== 'undefined' ? (is_vegan === '1' || is_vegan === 1 || is_vegan === true || is_vegan === 'true') ? 1 : 0 : (existingIsVegan ? 1 : 0);
    const finalIsGlutenFree = typeof is_gluten_free !== 'undefined' ? (is_gluten_free === '1' || is_gluten_free === 1 || is_gluten_free === true || is_gluten_free === 'true') ? 1 : 0 : (existingIsGlutenFree ? 1 : 0);
    const finalIsAvailable = typeof is_available !== 'undefined' ? (is_available === '1' || is_available === 1 || is_available === true || is_available === 'true') ? 1 : 0 : (existingIsAvailable ? 1 : 0);

    // Debug: Log the values being sent to database
    if (process.env.NODE_ENV === 'development') {
      console.log('Updating menu item with values:', {
        id,
        finalCategoryId,
        finalName,
        finalPrice,
        finalServings,
        finalPreparationTime,
        finalIsVegetarian,
        finalIsVegan,
        finalIsGlutenFree,
        finalIsAvailable
      });
    }

    // Execute the update query
    try {
      await connection.query(
        'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, servings = ?, preparation_time = ?, is_vegetarian = ?, is_vegan = ?, is_gluten_free = ?, is_available = ? WHERE id = ?',
        [finalCategoryId, finalName, finalDescription, finalPrice, finalServings, finalPreparationTime, finalIsVegetarian, finalIsVegan, finalIsGlutenFree, finalIsAvailable, id]
      );
    } catch (queryError) {
      connection.release();
      console.error('Database query error:', queryError);
      throw queryError; // Re-throw to be caught by outer catch
    }
    
    connection.release();

    res.json({ success: true, message: 'Menu item updated successfully', image: imagePath || undefined });
  } catch (error) {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
    
    // Log detailed error information
    console.error('Update menu item error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      name: error.name
    });
    
    // Don't send response if headers already sent
    if (res.headersSent) {
      return;
    }
    
    // Get the most descriptive error message
    const errorMessage = error.sqlMessage || 
                        error.message || 
                        (error.toString && error.toString()) || 
                        'Server error';
    
    const statusCode = error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_FIELD_ERROR' ? 500 : 
                       error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    
    // Always include error details in development, and basic info in production
    const errorResponse = {
      success: false, 
      message: errorMessage
    };
    
    // Add detailed error info in development mode
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      errorResponse.error = {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        errno: error.errno,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
      };
    }
    
    res.status(statusCode).json(errorResponse);
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

// Find best match for a menu item name (used to resolve preview items)
const findMatch = async (req, res) => {
  try {
    const name = String(req.query.name || '').trim();
    if (!name) return res.json({ success: true, item: null });

    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const n = norm(name);

    const connection = await pool.getConnection();

    // 1) Exact normalized match
    const [exactRows] = await connection.query('SELECT * FROM menu_items WHERE LOWER(name) = ? AND is_available = TRUE LIMIT 1', [n]);
    if (exactRows && exactRows.length) {
      connection.release();
      return res.json({ success: true, item: exactRows[0] });
    }

    // 2) Search by LIKE on name/description (case-insensitive). Limit to reasonable set.
    const likeParam = `%${name}%`;
    const [candidates] = await connection.query(
      'SELECT * FROM menu_items WHERE is_available = TRUE AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)) LIMIT 80',
      [likeParam, likeParam]
    );

    // Scoring helper
    const scoreName = (candidateName) => {
      const cn = norm(candidateName);
      let score = 0;
      if (cn.includes(n)) score += 5;
      const tokens = n.split(' ').filter((t) => t.length > 2);
      for (const t of tokens) if (cn.includes(t)) score += 1;
      return score;
    };

    let best = null;
    let bestScore = 0;
    for (const c of candidates) {
      const s = scoreName(c.name);
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
    if (best && bestScore > 0) {
      connection.release();
      return res.json({ success: true, item: best });
    }

    // 3) Final fallback: scan a larger set (if needed) and use same scoring
    const [allItems] = await connection.query('SELECT * FROM menu_items WHERE is_available = TRUE');
    best = null;
    bestScore = 0;
    for (const c of allItems) {
      const s = scoreName(c.name);
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
    connection.release();
    if (best && bestScore > 0) {
      return res.json({ success: true, item: best });
    }

    return res.json({ success: true, item: null });
  } catch (error) {
    console.error('findMatch error:', error);
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
  findMatch,
};
