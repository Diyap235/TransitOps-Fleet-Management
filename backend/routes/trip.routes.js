const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, repairStatusSync } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllTrips).post(createTrip);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

// Admin repair endpoint
router.post('/admin/repair-sync', repairStatusSync);

module.exports = router;
