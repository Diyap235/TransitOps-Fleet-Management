const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

const getAllMaintenance = async (req, res) => {
  try {
    const { status, vehicle } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicle) filter.vehicle = vehicle;
    const records = await Maintenance.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id).populate('vehicle', 'registrationNumber name');
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const { vehicle, description, cost, date } = req.body;
    if (!vehicle || !description || cost == null) {
      return res.status(400).json({ message: 'vehicle, description and cost are required' });
    }

    const veh = await Vehicle.findById(vehicle);
    if (!veh) return res.status(404).json({ message: 'Vehicle not found' });

    const record = await Maintenance.create({ vehicle, description, cost, date: date || Date.now(), status: 'Active' });

    // Mark vehicle as In Shop when maintenance is opened
    await Vehicle.findByIdAndUpdate(vehicle, { status: 'In Shop' });

    await record.populate('vehicle', 'registrationNumber name');
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });

    // When closing maintenance, set vehicle back to Available
    if (req.body.status === 'Closed' && record.status === 'Active') {
      await Vehicle.findByIdAndUpdate(record.vehicle, { status: 'Available' });
    }

    const updated = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });
    // Restore vehicle status if record was active
    if (record.status === 'Active') {
      await Vehicle.findByIdAndUpdate(record.vehicle, { status: 'Available' });
    }
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, deleteMaintenance };
