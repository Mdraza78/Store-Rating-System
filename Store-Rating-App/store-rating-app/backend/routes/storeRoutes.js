const router = require('express').Router();
const { createStore, listStores, getStore, deleteStore } = require('../controllers/storeController'); 
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('Store Owner','System Administrator'), createStore);
router.get('/', listStores);
router.get('/:id', getStore);
router.delete('/:id', protect, authorizeRoles('Store Owner','System Administrator'), deleteStore); 

module.exports = router;