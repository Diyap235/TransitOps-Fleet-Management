import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getTrips  = ()       => api.get('/trips');
export const getTrip   = (id)     => api.get(`/trips/${id}`);

export const createTrip = (data) =>
  api.post('/trips', data).then(res => { toast.success('Trip created'); return res; });

export const updateTrip = (id, data) =>
  api.put(`/trips/${id}`, data);

export const deleteTrip = (id) =>
  api.delete(`/trips/${id}`).then(res => { toast.success('Trip deleted'); return res; });
