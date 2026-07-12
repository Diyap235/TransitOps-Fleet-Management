import api from './axiosInstance';
import { toast } from 'react-hot-toast';

export const getDrivers  = ()       => api.get('/drivers');
export const getDriver   = (id)     => api.get(`/drivers/${id}`);

export const createDriver = (data) =>
  api.post('/drivers', data).then(res => { toast.success('Driver created'); return res; });

export const updateDriver = (id, data) =>
  api.put(`/drivers/${id}`, data).then(res => { toast.success('Driver updated'); return res; });

export const deleteDriver = (id) =>
  api.delete(`/drivers/${id}`).then(res => { toast.success('Driver deleted'); return res; });
