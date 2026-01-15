const StoreSchema = {
  store_id: 'SERIAL PRIMARY KEY',
  name: 'VARCHAR(255) NOT NULL',
  email: 'VARCHAR(255) UNIQUE NOT NULL',
  address: 'VARCHAR(400)',
  owner_id: 'INTEGER REFERENCES users(user_id) ON DELETE SET NULL', 
  created_at: 'TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'
};

module.exports = StoreSchema;