const pool = require('./db');

async function init() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(400),
      role VARCHAR(50) NOT NULL CHECK (role IN ('System Administrator', 'Normal User', 'Store Owner')),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`CREATE TABLE IF NOT EXISTS stores (
      store_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      address VARCHAR(400),
      owner_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`CREATE TABLE IF NOT EXISTS ratings (
      rating_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      store_id INTEGER NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >=1 AND rating <=5),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, store_id)
    );`);

    console.log('Database tables ensured');
  } catch (e) {
    console.error('DB init error:', e);
  }
}

init();

module.exports = {};
