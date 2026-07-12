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

    const [veh, drv] = await Promise.all([
      Vehicle.findById(vehicle),
      Driver.findById(driver),
    ]);
    if (!veh) return res.status(404).json({ message: 'Vehicle not found' });
    if (!drv) return res.status(404).json({ message: 'Driver not found' });

    // ── Server-side business rule validation ──────────────────────
    if (veh.status === 'Retired')
      return res.status(400).json({ message: 'Vehicle is Retired and cannot be dispatched' });
    if (veh.status === 'In Shop')
      return res.status(400).json({ message: 'Vehicle is currently In Shop for maintenance' });
    if (veh.status === 'On Trip')
      return res.status(400).json({ message: 'Vehicle is already On Trip' });
    if (drv.status === 'On Trip')
      return res.status(400).json({ message: 'Driver is already On Trip' });
    if (drv.status === 'Suspended')
      return res.status(400).json({ message: 'Driver is Suspended and cannot be assigned' });
    if (cargoWeight != null && veh.maxLoadCapacity && Number(cargoWeight) > veh.maxLoadCapacity)
      return res.status(400).json({ message: `Cargo weight (${cargoWeight} kg) exceeds vehicle max load capacity (${veh.maxLoadCapacity} kg)` });
    if (drv.licenseExpiryDate && new Date(drv.licenseExpiryDate) < new Date())
      return res.status(400).json({ message: `Driver license expired on ${new Date(drv.licenseExpiryDate).toLocaleDateString()}` });

    const trip = await Trip.create({ source, destination, vehicle, driver, cargoWeight, plannedDistance, status: 'Draft' });
    await trip.populate('vehicle', 'registrationNumber name');
    await trip.populate('driver', 'name licenseNumber');
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * syncTripRelatedStatuses — called whenever a trip moves to
 * Dispatched, Completed, or Cancelled.
 *
 * Uses the raw ObjectId values stored on the trip document
 * (trip.vehicle, trip.driver) rather than first fetching those
 * documents — this avoids the silent-null failure that happened
 * when findById returned null for a mismatched ID.
 */
const syncTripRelatedStatuses = async (trip, newStatus, finalOdometer) => {
  const vehicleId = trip.vehicle;
  const driverId  = trip.driver;

  if (newStatus === 'Dispatched') {
    await Promise.all([
      vehicleId && Vehicle.findByIdAndUpdate(vehicleId, { status: 'On Trip' }),
      driverId  && Driver.findByIdAndUpdate(driverId,  { status: 'On Trip' }),
    ]);
    return;
  }

  if (newStatus === 'Completed' || newStatus === 'Cancelled') {
    // Always revert — do not guard on fetching first so we never skip silently
    const vehicleUpdate = { status: 'Available' };
    if (newStatus === 'Completed' && finalOdometer) {
      vehicleUpdate.odometer = Number(finalOdometer);
    }

    await Promise.all([
      vehicleId && Vehicle.findByIdAndUpdate(vehicleId, vehicleUpdate),
      driverId  && Driver.findByIdAndUpdate(driverId,  { status: 'Available' }),
    ]);
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { status, finalOdometer, fuelConsumed } = req.body;

    // Only sync statuses when the status is actually changing
    if (status && status !== trip.status) {
      const [veh, drv] = await Promise.all([
        Vehicle.findById(trip.vehicle),
        Driver.findById(trip.driver),
      ]);

      if (status === 'Dispatched') {
        // Server-side guard: verify vehicle and driver are actually available
        if (veh && veh.status !== 'Available') {
          return res.status(400).json({ message: `Vehicle is currently ${veh.status} and cannot be dispatched` });
        }
        if (drv && drv.status !== 'Available') {
          return res.status(400).json({ message: `Driver is currently ${drv.status} and cannot be dispatched` });
        }
        if (veh) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'On Trip' });
        if (drv) await Driver.findByIdAndUpdate(trip.driver, { status: 'On Trip' });
      }
      if (status === 'Completed' || status === 'Cancelled') {
        if (veh) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available', ...(finalOdometer ? { odometer: finalOdometer } : {}) });
        if (drv) await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
      }
      await syncTripRelatedStatuses(trip, status, finalOdometer);
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

// Data repair endpoint: clean up stale On Trip statuses
const repairStatusSync = async (req, res) => {
  try {
    // Find all vehicles marked as On Trip
    const onTripVehicles = await Vehicle.find({ status: 'On Trip' });
    
    let repairedVehicles = 0;
    for (const vehicle of onTripVehicles) {
      // Check if there's an active Dispatched trip for this vehicle
      const activeTrip = await Trip.findOne({
        vehicle: vehicle._id,
        status: 'Dispatched',
      });
      
      // If no active trip, reset status to Available
      if (!activeTrip) {
        await Vehicle.findByIdAndUpdate(vehicle._id, { status: 'Available' });
        repairedVehicles++;
      }
    }

    // Same for drivers
    const onTripDrivers = await Driver.find({ status: 'On Trip' });
    let repairedDrivers = 0;
    for (const driver of onTripDrivers) {
      const activeTrip = await Trip.findOne({
        driver: driver._id,
        status: 'Dispatched',
      });
      
      if (!activeTrip) {
        await Driver.findByIdAndUpdate(driver._id, { status: 'Available' });
        repairedDrivers++;
      }
    }

    res.json({
      message: 'Status sync repair completed',
      vehiclesRepaired: repairedVehicles,
      driversRepaired: repairedDrivers,
/**
 * POST /api/trips/reconcile
 *
 * One-time reconciliation: finds all Completed/Cancelled trips
 * and ensures their linked vehicle and driver are set to Available,
 * provided those vehicle/driver are not currently On Trip for a
 * different Dispatched trip.
 *
 * Safe to call repeatedly — it only corrects stuck records.
 */
const reconcileStatuses = async (req, res) => {
  try {
    // Find all vehicle IDs and driver IDs still in Dispatched trips
    const dispatchedTrips = await Trip.find({ status: 'Dispatched' }).select('vehicle driver');
    const activeVehicleIds = new Set(dispatchedTrips.map(t => String(t.vehicle)));
    const activeDriverIds  = new Set(dispatchedTrips.map(t => String(t.driver)));

    // Collect all unique vehicle + driver IDs from completed/cancelled trips
    const doneTrips = await Trip.find({ status: { $in: ['Completed', 'Cancelled'] } }).select('vehicle driver');

    const vehiclesToFix = [];
    const driversToFix  = [];

    for (const t of doneTrips) {
      const vid = String(t.vehicle);
      const did = String(t.driver);
      if (!activeVehicleIds.has(vid)) vehiclesToFix.push(t.vehicle);
      if (!activeDriverIds.has(did))  driversToFix.push(t.driver);
    }

    // Only update those stuck on "On Trip" (don't touch Retired, In Shop etc.)
    const [vRes, dRes] = await Promise.all([
      Vehicle.updateMany(
        { _id: { $in: vehiclesToFix }, status: 'On Trip' },
        { $set: { status: 'Available' } }
      ),
      Driver.updateMany(
        { _id: { $in: driversToFix }, status: 'On Trip' },
        { $set: { status: 'Available' } }
      ),
    ]);

    res.json({
      message:         'Reconciliation complete',
      vehiclesFixed:   vRes.modifiedCount,
      driversFixed:    dRes.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, repairStatusSync };
module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, reconcileStatuses };
