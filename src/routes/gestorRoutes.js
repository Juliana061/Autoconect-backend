const express = require('express');
const router = express.Router();
const { protect, gestorOrAdmin } = require('../middleware/auth');
const { getAllVehicles, getAllDocuments, setValidado, getSummary } = require('../controllers/gestorController');

router.use(protect, gestorOrAdmin);

router.get('/summary', getSummary);
router.get('/vehicles', getAllVehicles);
router.get('/documents', getAllDocuments);
router.patch('/documents/:id/validado', setValidado);

module.exports = router;
