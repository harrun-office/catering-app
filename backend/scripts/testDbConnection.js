// scripts/testDbConnection.js
require('dotenv').config();
const path = require('path');
const pool = require(path.join(__dirname, '..', 'config', 'database'));

(async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as ok');
    connection.release();
    console.log('DB connection successful:', rows);
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err.message || err);
    process.exit(1);
  }
})();
