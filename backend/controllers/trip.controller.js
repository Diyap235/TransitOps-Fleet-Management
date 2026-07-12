const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const getAllTrips = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const trips = await Trip.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .populate('driver', 'name licenseNumber')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      const filtered = trips.filter(
        (t) =>
          t.source?.toLowerCase().includes(s) ||
          t.destination?.toLowerCase().includes(s) ||
          t.vehicle?.registrationNumber?.toLowerCase().includes(s) ||
          t.driver?.name?.toLowerCase().includes(s)
      );
      return res.json(filtered);
    }
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle', 'registrationNumber name odometer')
      .populate('driver', 'name licenseNumber');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;
    if (!source || !destination || !vehicle || !driver || plannedDistance == null) {
      return res.status(400).json({ message: 'source, destination, vehicle, driver and plannedDistance are required' });
    }

    // Validate vehicle and driver exist
    const [veh, drv] = await Promise.all([
      Vehicle.findById(vehicle),
      Driver.findById(driver),
    ]);
    if (!veh) return res.status(404).json({ message: 'Vehicle not found' });
    if (!drv) return res.status(404).json({ message: 'Driver not found' });
    if (veh.status !== 'Available') return res.status(400).json({ message: `Vehicle is currently ${veh.status}` });
    if (drv.status !== 'Available') return res.status(400).json({ message: `Driver is currently ${drv.status}` });

    const trip = await Trip.create({ source, destination, vehicle, driver, cargoWeight, plannedDistance, status: 'Draft' });
    await trip.populate('vehicle', 'registrationNumber name');
    await trip.populate('driver', 'name licenseNumber');
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { status, finalOdometer, fuelConsumed } = req.body;

    // Handle status transitions — update vehicle and driver status accordingly
    if (status && status !== trip.status) {
      const [veh, drv] = await Promise.all([
        Vehicle.findById(trip.vehicle),
        Driver.findById(trip.driver),
      ]);

      if (status === 'Dispatched') {
        if (veh) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'On Trip' });
        if (drv) await Driver.findByIdAndUpdate(trip.driver, { status: 'On Trip' });
      }
      if (status === 'Completed' || status === 'Cancelled') {
        if (veh) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available', ...(finalOdometer ? { odometer: finalOdometer } : {}) });
        if (drv) await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
      }
    }

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name')
      .populate('driver', 'name licenseNumber');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
