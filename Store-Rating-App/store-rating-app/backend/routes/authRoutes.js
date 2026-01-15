const router = require('express').Router();
const authController = require('../controllers/authController'); 
const { protect } = require('../middleware/authMiddleware'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;