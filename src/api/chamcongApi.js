import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/chamcong`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả chấm công
export const getAllChamCong = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() });

// Check-in
export const checkIn = (data) => axios.post(`${API_URL}/checkIn`, data, { headers: authHeaders() });

// Check-out
export const checkOut = (data) => axios.post(`${API_URL}/checkOut`, data, { headers: authHeaders() });

// Sửa chấm công
export const modifyChamCong = (data) => axios.put(`${API_URL}/modifierChamcong`, data, { headers: authHeaders() }); 