import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/phongban`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả phòng ban
export const getAllPhongBan = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() });

// Lấy phòng ban theo ID
export const getPhongBanById = (id) => axios.get(`${API_URL}/getById/${id}`);

// Thêm phòng ban
export const addPhongBan = (data) => axios.post(`${API_URL}/addPhongban`, data, { headers: authHeaders() });

// Sửa phòng ban
export const updatePhongBan = (id, data) => axios.put(`${API_URL}/updatePhongBan/${id}`, data, { headers: authHeaders() });

// Xóa phòng ban
export const deletePhongBan = (id) => axios.delete(`${API_URL}/deletePhongBan/${id}`, { headers: authHeaders() }); 