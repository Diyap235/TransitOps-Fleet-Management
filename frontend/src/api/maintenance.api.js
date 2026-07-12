import api from './axiosInstance';

export const getMaintenanceRecords = () => api.get('/maintenance');
export const getMaintenanceRecord = (id) => api.get(`/maintenance/${id}`);
export const createMaintenanceRecord = (data) => api.post('/maintenance', data);
export const updateMaintenanceRecord = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenanceRecord = (id) => api.delete(`/maintenance/${id}`);
