const router = require('express').Router();
const { rateStore, getUserRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:storeId', protect, rateStore);
router.get('/:storeId/me', protect, getUserRating);

module.exports = router;
