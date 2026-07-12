const express = require('express');
const router = express.Router();
const { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } = require('../controllers/driver.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllDrivers).post(createDriver);
router.route('/:id').get(getDriverById).put(updateDriver).delete(deleteDriver);

module.exports = router;
