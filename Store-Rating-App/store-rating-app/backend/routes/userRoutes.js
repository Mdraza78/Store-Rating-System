const router = require('express').Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorizeRoles('System Administrator'), userController.getAdminStats);
router.get('/', protect, authorizeRoles('System Administrator'), userController.listUsers);
router.delete('/:id', protect, authorizeRoles('System Administrator'), userController.deleteUser);

module.exports = router;