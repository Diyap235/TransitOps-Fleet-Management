import api from './axiosInstance';

// TODO: add report endpoints as they are defined in the backend
export const getFuelLogs = () => api.get('/fuel-logs');
export const getExpenses = () => api.get('/expenses');
