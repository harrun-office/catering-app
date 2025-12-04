// Test database connection
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 60000, // 60 seconds
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Connection successful!');

        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('✅ Query successful:', rows);

        await connection.end();
        console.log('✅ Connection closed');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        process.exit(1);
    }
}

testConnection();
