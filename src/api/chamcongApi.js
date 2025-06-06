import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/chamcong';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả chấm công
export const getAllChamCong = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() });

// Check-in
export const checkIn = (data) => axios.post(`${API_URL}/checkIn`, { ...data, token: localStorage.getItem('token') });

// Check-out
export const checkOut = (data) => axios.post(`${API_URL}/checkOut`, { ...data, token: localStorage.getItem('token') });

// Sửa chấm công
export const modifyChamCong = (data) => axios.put(`${API_URL}/modifierChamcong`, { ...data, token: localStorage.getItem('token') }); 