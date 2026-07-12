const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStatsByCategory,
  getOperationalCostByVehicle,
} = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllExpenses)
  .post(createExpense);

router.get('/stats/by-category', getExpenseStatsByCategory);
router.get('/stats/operational-cost', getOperationalCostByVehicle);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
