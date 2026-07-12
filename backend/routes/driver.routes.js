const express = require('express');
const router = express.Router();
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driver.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllDrivers)
  .post(authorize('FleetManager'), createDriver);

router.route('/:id')
  .get(getDriverById)
  .put(authorize('FleetManager'), updateDriver)
  .delete(authorize('FleetManager'), deleteDriver);

module.exports = router;
