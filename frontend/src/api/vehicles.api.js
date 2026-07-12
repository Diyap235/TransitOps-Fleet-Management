import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getVehicles  = ()       => api.get('/vehicles');
export const getVehicle   = (id)     => api.get(`/vehicles/${id}`);

export const createVehicle = (data) =>
  api.post('/vehicles', data).then(res => { toast.success('Vehicle created'); return res; });

export const updateVehicle = (id, data) =>
  api.put(`/vehicles/${id}`, data).then(res => { toast.success('Vehicle updated'); return res; });

export const deleteVehicle = (id) =>
  api.delete(`/vehicles/${id}`).then(res => { toast.success('Vehicle deleted'); return res; });
