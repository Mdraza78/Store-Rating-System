const pool = require('../config/db');

exports.rateStore = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating 1-5 required' });
    const upsert = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating=EXCLUDED.rating RETURNING *`,
      [userId, storeId, rating]
    );
    res.json(upsert.rows[0]);
  } catch (err) { next(err); }
};

exports.getUserRating = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const result = await pool.query('SELECT rating FROM ratings WHERE user_id=$1 AND store_id=$2', [userId, storeId]);
    res.json(result.rows[0] || {});
  } catch (err) { next(err); }
};
