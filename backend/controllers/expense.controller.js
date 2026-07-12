const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message,
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message,
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { vehicle, category, amount, date, note } = req.body;

    // If vehicle is provided, verify it exists
    if (vehicle) {
      const vehicleExists = await Vehicle.findById(vehicle);
      if (!vehicleExists) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
        });
      }
    }

    const expense = await Expense.create({
      vehicle,
      category,
      amount,
      date: date || Date.now(),
      note,
      loggedBy: req.user._id,
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating expense',
      error: error.message,
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { vehicle, category, amount, date, note } = req.body;

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

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { vehicle, category, amount, date, note },
      { new: true, runValidators: true }
    )
      .populate('vehicle', 'registrationNumber model')
      .populate('loggedBy', 'name email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating expense',
      error: error.message,
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message,
    });
  }
};

// @desc    Get expense statistics by category
// @route   GET /api/expenses/stats/by-category
// @access  Private
exports.getExpenseStatsByCategory = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense statistics',
      error: error.message,
    });
  }
};

// @desc    Get total operational cost by vehicle
// @route   GET /api/expenses/stats/operational-cost
// @access  Private
exports.getOperationalCostByVehicle = async (req, res) => {
  try {
    // Aggregate expenses by vehicle
    const expensesByVehicle = await Expense.aggregate([
      {
        $match: { vehicle: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: '$vehicle',
          totalExpenses: { $sum: '$amount' },
        },
      },
    ]);

    // Aggregate fuel costs by vehicle (importing FuelLog)
    const FuelLog = require('../models/FuelLog');
    const fuelByVehicle = await FuelLog.aggregate([
      {
        $group: {
          _id: '$vehicle',
          totalFuelCost: { $sum: '$cost' },
        },
      },
    ]);

    // Aggregate maintenance costs by vehicle (if maintenance has cost field)
    const Maintenance = require('../models/Maintenance');
    const maintenanceByVehicle = await Maintenance.aggregate([
      {
        $match: { cost: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: '$vehicle',
          totalMaintenanceCost: { $sum: '$cost' },
        },
      },
    ]);

    // Combine all costs
    const costMap = new Map();

    expensesByVehicle.forEach(item => {
      const vehicleId = item._id.toString();
      costMap.set(vehicleId, {
        vehicle: item._id,
        totalExpenses: item.totalExpenses || 0,
        totalFuelCost: 0,
        totalMaintenanceCost: 0,
      });
    });

    fuelByVehicle.forEach(item => {
      const vehicleId = item._id.toString();
      if (costMap.has(vehicleId)) {
        costMap.get(vehicleId).totalFuelCost = item.totalFuelCost || 0;
      } else {
        costMap.set(vehicleId, {
          vehicle: item._id,
          totalExpenses: 0,
          totalFuelCost: item.totalFuelCost || 0,
          totalMaintenanceCost: 0,
        });
      }
    });

    maintenanceByVehicle.forEach(item => {
      const vehicleId = item._id.toString();
      if (costMap.has(vehicleId)) {
        costMap.get(vehicleId).totalMaintenanceCost = item.totalMaintenanceCost || 0;
      } else {
        costMap.set(vehicleId, {
          vehicle: item._id,
          totalExpenses: 0,
          totalFuelCost: 0,
          totalMaintenanceCost: item.totalMaintenanceCost || 0,
        });
      }
    });

    // Convert map to array and calculate total operational cost
    const result = Array.from(costMap.values()).map(item => ({
      ...item,
      totalOperationalCost: item.totalExpenses + item.totalFuelCost + item.totalMaintenanceCost,
    }));

    // Populate vehicle details
    const Vehicle = require('../models/Vehicle');
    const populatedResult = await Promise.all(
      result.map(async item => {
        const vehicle = await Vehicle.findById(item.vehicle).select('registrationNumber model type');
        return {
          ...item,
          vehicleDetails: vehicle,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedResult.sort((a, b) => b.totalOperationalCost - a.totalOperationalCost),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching operational cost statistics',
      error: error.message,
    });
  }
};
