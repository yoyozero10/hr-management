import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/danhgia`;

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả đánh giá (có thể lọc theo employeeId, ky, nam), gửi token cả body và header
export const getAllDanhGia = (filter = {}) =>
  axios.post(
    `${API_URL}/getAll`,
    { ...filter, token: getToken() },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );

// Thêm mới đánh giá
export const addDanhGia = (data) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/addDanhGia`,
    { ...data, token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}; 