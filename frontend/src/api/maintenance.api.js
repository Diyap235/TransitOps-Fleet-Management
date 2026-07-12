import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getMaintenanceRecords = () => api.get('/maintenance');
export const getMaintenanceRecord = (id) => api.get(`/maintenance/${id}`);
export const createMaintenanceRecord = (data) => api.post('/maintenance', data)
  .then((response) => {
    toast.success('Maintenance record created successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const updateMaintenanceRecord = (id, data) => api.put(`/maintenance/${id}`, data)
  .then((response) => {
    toast.success('Maintenance record updated successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const deleteMaintenanceRecord = (id) => api.delete(`/maintenance/${id}`)
  .then((response) => {
    toast.success('Maintenance record deleted successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
