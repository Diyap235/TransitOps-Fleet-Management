const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

const getAllExpenses = async (req, res) => {
  try {
    const { vehicle, type } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    if (type) filter.type = type;
    const expenses = await Expense.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('vehicle', 'registrationNumber name');
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { vehicle, type, amount, date } = req.body;
    if (!vehicle || !type || amount == null) {
      return res.status(400).json({ message: 'vehicle, type and amount are required' });
    }
    const veh = await Vehicle.findById(vehicle);
    if (!veh) return res.status(404).json({ message: 'Vehicle not found' });

    const expense = await Expense.create({ vehicle, type, amount, date: date || Date.now() });
    await expense.populate('vehicle', 'registrationNumber name');
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name');
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense };
