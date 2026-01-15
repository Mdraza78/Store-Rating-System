const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); 

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

async function testDbConnection() {
  try {
    await pool.query('SELECT 1');
    console.log(' Database connected successfully');
  } catch (err) {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  }
}

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await testDbConnection();
  
  app.listen(PORT, () => {
    console.log(`\n Server started successfully!`);
    console.log(` Port: ${PORT}`);
    console.log(` API Base URL: http://localhost:${PORT}/api`);
    
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});