const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllTrips).post(createTrip);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

module.exports = router;
