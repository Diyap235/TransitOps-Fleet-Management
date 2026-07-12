// Expense Controller — implement CRUD logic here

const getAllExpenses = async (req, res) => {
  // TODO: fetch all expenses, optionally filter by vehicle or type
  res.status(501).json({ message: 'getAllExpenses — not yet implemented' });
};

const getExpenseById = async (req, res) => {
  // TODO: fetch single expense by id
  res.status(501).json({ message: 'getExpenseById — not yet implemented' });
};

const createExpense = async (req, res) => {
  // TODO: create new expense entry
  res.status(501).json({ message: 'createExpense — not yet implemented' });
};

const updateExpense = async (req, res) => {
  // TODO: update expense entry
  res.status(501).json({ message: 'updateExpense — not yet implemented' });
};

const deleteExpense = async (req, res) => {
  // TODO: remove expense entry
  res.status(501).json({ message: 'deleteExpense — not yet implemented' });
};

module.exports = { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense };
