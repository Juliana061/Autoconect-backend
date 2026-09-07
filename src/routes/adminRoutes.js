const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, getAllVehicles, getAllDocuments, getSummary } = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/summary', getSummary);
router.get('/users', getAllUsers);
router.get('/vehicles', getAllVehicles);
router.get('/documents', getAllDocuments);

module.exports = router;
