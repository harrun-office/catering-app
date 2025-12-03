/**
 * run_sql.js
 * Reads SQL file (default: schema.sql) and executes it against MySQL using mysql2.
 * Expects DB credentials in .env (MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const SQL_FILE = process.env.SQL_FILE || path.join(__dirname, 'schema.sql');

  if (!fs.existsSync(SQL_FILE)) {
    console.error('SQL file not found:', SQL_FILE);
    process.exit(1);
  }

  const sql = fs.readFileSync(SQL_FILE, 'utf8');

  const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
  const port = process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT, 10) : (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306);
  const user = process.env.MYSQLUSER || process.env.DB_USER;
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
  const database = process.env.MYSQLDATABASE || process.env.DB_DATABASE || undefined;

  if (!user || !password) {
    console.error('Missing DB credentials. Ensure MYSQLUSER and MYSQLPASSWORD are present in .env');
    process.exit(1);
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,            // optional; the SQL file may include CREATE DATABASE / USE
      multipleStatements: true,
      connectTimeout: 10000
    });

    console.log('Connected to DB. Executing SQL file:', SQL_FILE);
    // Execute file. Use query for multipleStatements.
    const [results] = await conn.query(sql);
    console.log('SQL executed successfully.');
    if (Array.isArray(results)) {
      console.log('Approx executed statements:', results.length);
    }
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error executing SQL:', err && err.message ? err.message : err);
    if (conn && conn.end) await conn.end().catch(()=>{});
    process.exit(2);
  }
})();
