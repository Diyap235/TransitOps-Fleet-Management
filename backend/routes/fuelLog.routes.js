const express = require('express');
const router = express.Router();
const {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuelLog.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllFuelLogs)
  .post(authorize('FleetManager', 'Driver'), createFuelLog);

router.route('/:id')
  .get(getFuelLogById)
  .put(authorize('FleetManager'), updateFuelLog)
  .delete(authorize('FleetManager'), deleteFuelLog);

module.exports = router;
