// scripts/verifySeed.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../src/config/database');

(async () => {
  try {
    const conn = await pool.getConnection();
    const [cats] = await conn.query('SELECT COUNT(*) as c FROM categories');
    console.log('categories count:', cats[0].c);
    const [items] = await conn.query('SELECT COUNT(*) as c FROM menu_items');
    console.log('menu_items count:', items[0].c);
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err.message || err);
    process.exit(1);
  }
})();
