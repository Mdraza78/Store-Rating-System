const { Pool } = require('pg');
require('dotenv').config();
const { DATABASE_URL } = process.env;

let poolConfig;
if (DATABASE_URL) {
  poolConfig = {
    connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
  };
} else {
  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected PG client error', err);
  process.exit(-1);
});

module.exports = pool;
