const express = require('express');
const router = express.Router();
const {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenance.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllMaintenance)
  .post(authorize('FleetManager', 'SafetyOfficer'), createMaintenance);

router.route('/:id')
  .get(getMaintenanceById)
  .put(authorize('FleetManager', 'SafetyOfficer'), updateMaintenance)
  .delete(authorize('FleetManager'), deleteMaintenance);

module.exports = router;
