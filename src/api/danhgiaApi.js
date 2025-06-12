import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/danhgia`;

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả đánh giá (sử dụng GET mới)
export const getAllDanhGia = (params = {}) => {
  const token = getToken();
  return axios.get(
    `${API_BASE_URL}/danhgianew/getAll`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Thêm mới đánh giá
export const addDanhGia = (data) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/addDanhGia`,
    { ...data, token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}; 