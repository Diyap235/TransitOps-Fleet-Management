const express = require('express');
const router = express.Router();
const {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
  getFuelEfficiencyStats,
} = require('../controllers/fuelLog.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllFuelLogs)
  .post(createFuelLog);

router.get('/stats/efficiency', getFuelEfficiencyStats);

router.route('/:id')
  .get(getFuelLogById)
  .put(updateFuelLog)
  .delete(deleteFuelLog);

module.exports = router;
