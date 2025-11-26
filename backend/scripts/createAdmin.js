// scripts/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const path = require('path');

// Adjust this require if your DB file is in a different place.
// This expects: D:\Fresher-Tasks\cater\backend\config\database.js
const pool = require(path.join(__dirname, '..', 'config', 'database'));

(async () => {
  try {
    const connection = await pool.getConnection();
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hashed = await bcrypt.hash(password, 10);

    // Check existing admin
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin already exists, exiting.');
      connection.release();
      process.exit(0);
    }

    const [result] = await connection.query(
      'INSERT INTO users (first_name, last_name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin', 'User', email, hashed, 'admin', true]
    );

    connection.release();
    console.log('Admin created with id:', result.insertId);
    console.log('Email:', email, 'Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message || err);
    process.exit(1);
  }
})();
