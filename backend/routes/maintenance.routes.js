const express = require('express');
const router = express.Router();
const { getAllMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenance.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllMaintenance).post(createMaintenance);
router.route('/:id').get(getMaintenanceById).put(updateMaintenance).delete(deleteMaintenance);

module.exports = router;
