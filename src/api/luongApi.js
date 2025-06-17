import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/luong`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả phiếu lương
export const getAllPhieuLuong = () => {
  return axios.get(
    `${API_URL}/getAllPhieuLuong`,
    { headers: authHeaders() }
  );
};

// Lấy phiếu lương có lọc
export const getFilteredPhieuLuong = (filter) => {
  return axios.post(
    `${API_URL}/getFilteredPhieuLuong`,
    filter,
    { headers: authHeaders() }
  );
};

// Tính toán lương
export const calculateSalary = (data) => {
  // Convert data to query string
  const params = new URLSearchParams();
  if (data.employeeId) params.append('employeeId', data.employeeId);
  if (data.thang) params.append('thang', data.thang);
  if (data.nam) params.append('nam', data.nam);

  return axios.get(
    `${API_URL}/Calculate?${params.toString()}`,
    { headers: authHeaders() }
  );
}; 