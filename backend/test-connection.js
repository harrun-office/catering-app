// backend/test-connection.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const [[row]] = await conn.query('SELECT VERSION() AS v');
        console.log('MySQL connected — server version:', row.v);
        await conn.end();
    } catch (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
}
test();
