const pool = require('../config/db');

exports.getAdminStats = async (req, res, next) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const storeCount = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await pool.query('SELECT COUNT(*) FROM ratings');
    
    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalStores: parseInt(storeCount.rows[0].count),
      totalRatings: parseInt(ratingCount.rows[0].count)
    });
  } catch (err) { next(err); }
};


exports.listUsers = async (req, res, next) => {
  try {
    const query = `
      SELECT u.user_id, u.name, u.email, u.address, u.role,
      CASE 
        WHEN u.role = 'Store Owner' THEN (
          SELECT COALESCE(AVG(r.rating), 0) 
          FROM ratings r 
          JOIN stores s ON s.store_id = r.store_id 
          WHERE s.owner_id = u.user_id
        )
        ELSE NULL 
      END as rating
      FROM users u 
      ORDER BY u.user_id DESC
    `;
    const result = await pool.query(query);

    console.log("Users from DB:", result.rows);
    console.log("Rows count:", result.rows.length);

    res.json(result.rows);
    
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) { next(err); }
};