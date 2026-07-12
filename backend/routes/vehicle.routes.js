const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicle.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect); // all vehicle routes require authentication

router.route('/')
  .get(getAllVehicles)
  .post(authorize('FleetManager'), createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(authorize('FleetManager'), updateVehicle)
  .delete(authorize('FleetManager'), deleteVehicle);

module.exports = router;
