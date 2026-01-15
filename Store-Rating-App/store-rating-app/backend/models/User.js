
const UserSchema = {
  user_id: 'SERIAL PRIMARY KEY',
  name: 'VARCHAR(60) NOT NULL', 
  email: 'VARCHAR(255) UNIQUE NOT NULL', 
  password: 'VARCHAR(255) NOT NULL', 
  address: 'VARCHAR(400)', 
  role: "CHECK (role IN ('System Administrator', 'Normal User', 'Store Owner'))", 
  created_at: 'TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'
};

module.exports = UserSchema;