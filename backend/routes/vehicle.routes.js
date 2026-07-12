const express = require('express');
const router = express.Router();
const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicle.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllVehicles).post(createVehicle);
router.route('/:id').get(getVehicleById).put(updateVehicle).delete(deleteVehicle);

module.exports = router;
