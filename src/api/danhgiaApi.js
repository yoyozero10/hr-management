import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/danhgia';
function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả đánh giá (có thể lọc theo employeeId, ky, nam)
export const getAllDanhGia = (filter = {}) =>
  axios.post(`${API_URL}/getAll`, { ...filter, token: getToken() });

// Thêm mới đánh giá
export const addDanhGia = (data) =>
  axios.post(`${API_URL}/addDanhGia`, { ...data, token: getToken() }); 