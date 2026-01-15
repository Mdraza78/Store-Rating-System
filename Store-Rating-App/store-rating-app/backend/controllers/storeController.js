const pool = require('../config/db'); 

exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Store name is required' });
    }
    
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Store email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be under 400 characters' });
    }

    let ownerId = req.user.id;
    
    if (req.user.role === 'System Administrator' && req.body.owner_id) {
      ownerId = req.body.owner_id;
    }

    const existingStore = await pool.query(
      'SELECT store_id FROM stores WHERE email = $1',
      [email]
    );
    
    if (existingStore.rows.length > 0) {
      return res.status(409).json({ message: 'Store email already registered' });
    }

    const insert = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), email.trim(), address ? address.trim() : null, ownerId]
    );
    
    res.status(201).json(insert.rows[0]);
  } catch (err) { 
    console.error('Create store error:', err);
    
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Store email already exists' });
    }
    
    next(err); 
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const storeCheck = await pool.query(
      'SELECT * FROM stores WHERE store_id = $1',
      [id]
    );

    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const store = storeCheck.rows[0];

    if (userRole !== 'System Administrator' && store.owner_id !== userId) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this store' 
      });
    }

    await pool.query('DELETE FROM stores WHERE store_id = $1', [id]);

    res.json({ 
      message: 'Store deleted successfully',
      deletedStoreId: id
    });
  } catch (err) {
    console.error('Delete store error:', err);
    
    if (err.code === '23503') {
      return res.status(400).json({ 
        message: 'Cannot delete store due to existing references' 
      });
    }
    
    next(err);
  }
};

exports.listStores = async (req, res, next) => {
  try {
    const { search, sortBy = 'name', order = 'DESC' } = req.query;

    let query = `
      SELECT s.store_id, s.name, s.email, s.address, s.owner_id, 
      COALESCE(AVG(r.rating), 0) AS average_rating, 
      COUNT(r.rating_id) AS rating_count 
      FROM stores s 
      LEFT JOIN ratings r ON s.store_id = r.store_id 
    `;
    
    const params = [];

    if (search) {
      query += ` WHERE s.name ILIKE $1 OR s.address ILIKE $1 `;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY s.store_id `;
    
    const validSortFields = ['name', 'email', 'address', 'average_rating', 'owner_id'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    query += ` ORDER BY ${sortField} ${order === 'ASC' ? 'ASC' : 'DESC'}`;

    const stores = await pool.query(query, params);

    res.json(stores.rows);
  } catch (err) { 
    console.error('List stores error:', err);
    next(err); 
  }
};

exports.getStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT s.*, 
       COALESCE(AVG(r.rating), 0) as average_rating,
       COUNT(r.rating_id) as rating_count
       FROM stores s
       LEFT JOIN ratings r ON s.store_id = r.store_id
       WHERE s.store_id = $1
       GROUP BY s.store_id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get store error:', err);
    next(err);
  }
};