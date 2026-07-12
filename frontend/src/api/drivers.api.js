import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getDrivers = () => api.get('/drivers');
export const getDriver = (id) => api.get(`/drivers/${id}`);
export const createDriver = (data) => api.post('/drivers', data)
  .then((response) => {
    toast.success('Driver created successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const updateDriver = (id, data) => api.put(`/drivers/${id}`, data)
  .then((response) => {
    toast.success('Driver updated successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const deleteDriver = (id) => api.delete(`/drivers/${id}`)
  .then((response) => {
    toast.success('Driver deleted successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
