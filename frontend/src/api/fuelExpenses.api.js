import api from './axiosInstance';

// ─── Fuel Logs ───────────────────────────────────────────────────────────────

export const getAllFuelLogs = () => api.get('/fuel-logs');
export const getFuelLogById = (id) => api.get(`/fuel-logs/${id}`);
export const createFuelLog = (data) => api.post('/fuel-logs', data);
export const updateFuelLog = (id, data) => api.put(`/fuel-logs/${id}`, data);
export const deleteFuelLog = (id) => api.delete(`/fuel-logs/${id}`);
export const getFuelEfficiencyStats = () => api.get('/fuel-logs/stats/efficiency');

// ─── Expenses ────────────────────────────────────────────────────────────────

export const getAllExpenses = () => api.get('/expenses');
export const getExpenseById = (id) => api.get(`/expenses/${id}`);
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getExpenseStatsByCategory = () => api.get('/expenses/stats/by-category');
export const getOperationalCostByVehicle = () => api.get('/expenses/stats/operational-cost');
