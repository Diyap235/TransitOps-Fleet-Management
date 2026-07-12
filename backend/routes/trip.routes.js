const express = require('express');
const router = express.Router();
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/trip.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllTrips)
  .post(authorize('FleetManager'), createTrip);

router.route('/:id')
  .get(getTripById)
  .put(authorize('FleetManager'), updateTrip)
  .delete(authorize('FleetManager'), deleteTrip);

module.exports = router;
