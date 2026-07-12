const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllExpenses)
  .post(authorize('FleetManager', 'FinancialAnalyst'), createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(authorize('FleetManager', 'FinancialAnalyst'), updateExpense)
  .delete(authorize('FleetManager'), deleteExpense);

module.exports = router;
