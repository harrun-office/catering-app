// backend/config/config.js
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD ?? process.env.DB_PASS ?? null;

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: dbPassword,
    database: process.env.DB_NAME || 'catering_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: dbPassword,
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'catering_db_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: dbPassword,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  }
};
