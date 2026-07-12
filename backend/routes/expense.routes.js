const express = require('express');
const router = express.Router();
const { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getAllExpenses).post(createExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
