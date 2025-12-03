// run_sql.js
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
  const port = process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : (process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306);
  const user =process.env.DB_USER ;
  const password = process.env.DB_PASSWORD  ;
  const database = process.env.MYSQLDATABASE || process.env.DB_DATABASE || undefined;

  if (!user || !password) {
    console.error('Missing DB credentials. Ensure MYSQLUSER and MYSQLPASSWORD are present in .env');
    process.exit(1);
  }

  try {
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,            // optional, SQL file may switch DB on its own
      multipleStatements: true
    });

    console.log('Connected to DB. Executing SQL file:', SQL_FILE);
    const [results] = await conn.query(sql);
    console.log('SQL executed successfully.');
    // optional: print summary for first few results
    if (Array.isArray(results)) {
      console.log('Number of statements executed (approx):', results.length);
    } else {
      console.log('Result:', results);
    }
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error executing SQL:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
