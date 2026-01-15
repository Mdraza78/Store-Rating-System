const RatingSchema = {
  rating_id: 'SERIAL PRIMARY KEY',
  user_id: 'INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE',
  store_id: 'INTEGER NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE',
  rating: 'INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)', 
  created_at: 'TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP',
  unique_user_store: 'UNIQUE (user_id, store_id)'
};

module.exports = RatingSchema;