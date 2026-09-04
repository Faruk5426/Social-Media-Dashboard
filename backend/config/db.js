const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'social_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('connect', () => console.log('PostgreSQL pool: client connected'));
pool.on('error', (err) => console.error('Unexpected PostgreSQL error', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
