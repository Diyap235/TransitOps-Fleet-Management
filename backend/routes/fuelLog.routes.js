const express = require('express');
const router = express.Router();
const { getAllFuelLogs, getFuelLogById, createFuelLog, updateFuelLog, deleteFuelLog } = require('../controllers/fuelLog.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllFuelLogs).post(createFuelLog);
router.route('/:id').get(getFuelLogById).put(updateFuelLog).delete(deleteFuelLog);

module.exports = router;
