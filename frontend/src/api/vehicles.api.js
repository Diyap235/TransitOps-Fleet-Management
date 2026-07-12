import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getVehicles = () => api.get('/vehicles');
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data)
  .then((response) => {
    toast.success('Vehicle created successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data)
  .then((response) => {
    toast.success('Vehicle updated successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`)
  .then((response) => {
    toast.success('Vehicle deleted successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
