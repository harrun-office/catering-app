// scripts/runMigrationsAndSeed.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

(async () => {
  const schemaPath = path.join(__dirname, '..', 'src', 'utils', 'database.sql');
  const seedPath = path.join(__dirname, '..', '..', 'seed-menu-data.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
      multipleStatements: true,
    });

    console.log('Connected to MySQL server (no default database). Running schema...');
    await connection.query(schemaSql);
    console.log('Schema applied successfully.');

    console.log('Running seed SQL...');
    await connection.query(seedSql);
    console.log('Seed data applied successfully.');

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration/seed failed:', err.message || err);
    if (connection && connection.end) await connection.end();
    process.exit(1);
  }
})();
