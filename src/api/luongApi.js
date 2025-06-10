import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/luong`;

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả phiếu lương
export const getAllPhieuLuong = () => {
  const token = getToken();
  return axios.post(
    `${API_URL}/getAllPhieuLuong`,
    { token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Lấy phiếu lương có lọc
export const getFilteredPhieuLuong = (filter) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/getFilteredPhieuLuong`,
    { ...filter, token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}; 