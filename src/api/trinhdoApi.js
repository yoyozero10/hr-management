import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/trinhdo`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả trình độ
export const getAllTrinhDo = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() });

// Lấy trình độ theo ID
export const getTrinhDoById = (id) => axios.get(`${API_URL}/getById/${id}`);

// Thêm trình độ
export const addTrinhDo = (data) => axios.post(`${API_URL}/addTrinhdo`, data, { headers: authHeaders() });

// Sửa trình độ
export const updateTrinhDo = (id, data) => axios.put(`${API_URL}/updateTrinhdo/${id}`, data, { headers: authHeaders() });

// Xóa trình độ
export const deleteTrinhDo = (id) => axios.delete(`${API_URL}/deleteTrinhdo/${id}`, { headers: authHeaders() }); 