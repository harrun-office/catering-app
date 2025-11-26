const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { validateUserData, validateEmail, validatePassword } = require('../utils/validators');
const pool = require('../config/database');

// Register User
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    // Validate input
    const errors = validateUserData({ first_name, last_name, email, password, phone });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const connection = await pool.getConnection();

    // Check if user exists
    const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await connection.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone, 'user']
    );

    connection.release();

    const token = generateToken({
      id: result.insertId,
      email,
      role: 'user',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        email,
        first_name,
        last_name,
        role: 'user',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const connection = await pool.getConnection();

    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      connection.release();
      return res.status(403).json({ success: false, message: 'User account is inactive' });
    }

    connection.release();

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, first_name, last_name, email, phone, address, city, profile_image, role FROM users WHERE id = ?', [
      req.user.id,
    ]);
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, address, city, zip_code } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, zip_code = ? WHERE id = ?',
      [first_name, last_name, phone, address, city, zip_code, req.user.id]
    );
    connection.release();

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
};
