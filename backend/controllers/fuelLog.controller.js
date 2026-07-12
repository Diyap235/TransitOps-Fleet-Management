const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

// @desc    Get all fuel logs
// @route   GET /api/fuel-logs
// @access  Private
exports.getAllFuelLogs = async (req, res) => {
  try {
    const fuelLogs = await FuelLog.find()
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: fuelLogs.length,
      data: fuelLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fuel logs',
      error: error.message,
    });
  }
};

// @desc    Get single fuel log
// @route   GET /api/fuel-logs/:id
// @access  Private
exports.getFuelLogById = async (req, res) => {
  try {
    const fuelLog = await FuelLog.findById(req.params.id)
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    if (!fuelLog) {
      return res.status(404).json({
        success: false,
        message: 'Fuel log not found',
      });
    }

    res.status(200).json({
      success: true,
      data: fuelLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fuel log',
      error: error.message,
    });
  }
};

// @desc    Create new fuel log
// @route   POST /api/fuel-logs
// @access  Private
exports.createFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost, date, odometerReading, notes } = req.body;

    // Verify vehicle exists
    const vehicleExists = await Vehicle.findById(vehicle);
    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const fuelLog = await FuelLog.create({
      vehicle,
      liters,
      cost,
      date: date || Date.now(),
      odometerReading,
      notes,
      loggedBy: req.user._id,
    });

    const populatedLog = await FuelLog.findById(fuelLog._id)
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedLog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating fuel log',
      error: error.message,
    });
  }
};

// @desc    Update fuel log
// @route   PUT /api/fuel-logs/:id
// @access  Private
exports.updateFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost, date, odometerReading, notes } = req.body;

    // If vehicle is being updated, verify it exists
    if (vehicle) {
      const vehicleExists = await Vehicle.findById(vehicle);
      if (!vehicleExists) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
        });
      }
    }

    const fuelLog = await FuelLog.findByIdAndUpdate(
      req.params.id,
      { vehicle, liters, cost, date, odometerReading, notes },
      { new: true, runValidators: true }
    )
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    if (!fuelLog) {
      return res.status(404).json({
        success: false,
        message: 'Fuel log not found',
      });
    }

    res.status(200).json({
      success: true,
      data: fuelLog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating fuel log',
      error: error.message,
    });
  }
};

// @desc    Delete fuel log
// @route   DELETE /api/fuel-logs/:id
// @access  Private
exports.deleteFuelLog = async (req, res) => {
  try {
    const fuelLog = await FuelLog.findByIdAndDelete(req.params.id);

    if (!fuelLog) {
      return res.status(404).json({
        success: false,
        message: 'Fuel log not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fuel log deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting fuel log',
      error: error.message,
    });
  }
};

// @desc    Get fuel efficiency stats
// @route   GET /api/fuel-logs/stats/efficiency
// @access  Private
exports.getFuelEfficiencyStats = async (req, res) => {
  try {
    const stats = await FuelLog.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicleData',
        },
      },
      {
        $unwind: '$vehicleData',
      },
      {
        $group: {
          _id: '$vehicle',
          registrationNumber: { $first: '$vehicleData.registrationNumber' },
          model: { $first: '$vehicleData.model' },
          totalLiters: { $sum: '$liters' },
          totalCost: { $sum: '$cost' },
          logCount: { $sum: 1 },
          avgCostPerLiter: { $avg: { $divide: ['$cost', '$liters'] } },
        },
      },
      {
        $sort: { totalCost: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fuel efficiency stats',
      error: error.message,
    });
  }
};
