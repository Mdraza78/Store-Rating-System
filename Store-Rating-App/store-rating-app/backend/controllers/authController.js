const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES_IN = '7d';


exports.register = async (req, res, next) => {
  try {
    const { name, email, password, address, role = 'Normal User' } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

  if (!name || name.length < 1 || name.length > 60) {
  return res.status(400).json({ message: 'Name must be between 1 and 60 characters' });
}

    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    }

 
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8-16 chars, include 1 uppercase and 1 special character' 
      });
    }


    const allowedRoles = ['Normal User', 'Store Owner', 'System Administrator'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }


    const existing = await pool.query('SELECT user_id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const insertRes = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5) RETURNING user_id, name, email, role',
      [name, email, hash, address || null, role]
    );

    const user = insertRes.rows[0];
    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    res.status(201).json({ user, token });
  } catch (err) { 
    next(err); 
  }
};


exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    const result = await pool.query('SELECT password FROM users WHERE user_id=$1', [userId]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'New password must be 8-16 chars, include 1 uppercase and 1 special character' 
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=$1 WHERE user_id=$2', [hash, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    delete user.password;
    res.json({ user, token });
  } catch (err) { next(err); }
};
