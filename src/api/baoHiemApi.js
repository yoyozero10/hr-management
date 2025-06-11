import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_BASE = `${API_BASE_URL}/baohiem`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAllBaoHiem = () => axios.get(`${API_BASE}/getAll`, { headers: authHeaders() });
export const getBaoHiemById = (id) => axios.get(`${API_BASE}/getById/${id}`, { headers: authHeaders() });
export const addBaoHiem = (data) => axios.post(`${API_BASE}/addBaoHiem`, data, { headers: authHeaders() });
export const updateBaoHiem = (id, data) => axios.put(`${API_BASE}/updateBaoHiem/${id}`, data, { headers: authHeaders() });
export const deleteBaoHiem = (id) => axios.delete(`${API_BASE}/deleteBaoHiem/${id}`, { headers: authHeaders() }); 

