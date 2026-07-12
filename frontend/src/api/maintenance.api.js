import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getMaintenanceRecords  = ()       => api.get('/maintenance');
export const getMaintenanceRecord   = (id)     => api.get(`/maintenance/${id}`);

export const createMaintenanceRecord = (data) =>
  api.post('/maintenance', data).then(res => { toast.success('Maintenance record created'); return res; });

export const updateMaintenanceRecord = (id, data) =>
  api.put(`/maintenance/${id}`, data);

export const deleteMaintenanceRecord = (id) =>
  api.delete(`/maintenance/${id}`).then(res => { toast.success('Record deleted'); return res; });
