import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data)
  .then((response) => {
    toast.success('Trip created successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data)
  .then((response) => {
    toast.success('Trip updated successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
export const deleteTrip = (id) => api.delete(`/trips/${id}`)
  .then((response) => {
    toast.success('Trip deleted successfully');
    return response;
  })
  .catch((error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });
