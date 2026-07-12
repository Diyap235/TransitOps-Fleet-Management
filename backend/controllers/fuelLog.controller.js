const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

const getAllFuelLogs = async (req, res) => {
  try {
    const { vehicle } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    const logs = await FuelLog.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFuelLogById = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id).populate('vehicle', 'registrationNumber name');
    if (!log) return res.status(404).json({ message: 'Fuel log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost, date } = req.body;
    if (!vehicle || liters == null || cost == null) {
      return res.status(400).json({ message: 'vehicle, liters and cost are required' });
    }
    const veh = await Vehicle.findById(vehicle);
    if (!veh) return res.status(404).json({ message: 'Vehicle not found' });

    const log = await FuelLog.create({ vehicle, liters, cost, date: date || Date.now() });
    await log.populate('vehicle', 'registrationNumber name');
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name');
    if (!log) return res.status(404).json({ message: 'Fuel log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Fuel log not found' });
    res.json({ message: 'Fuel log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllFuelLogs, getFuelLogById, createFuelLog, updateFuelLog, deleteFuelLog };
