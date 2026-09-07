const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

router.use(protect);
router.route('/').post(createVehicle).get(getVehicles);
router.route('/:id').get(getVehicle).put(updateVehicle).delete(deleteVehicle);

module.exports = router;
