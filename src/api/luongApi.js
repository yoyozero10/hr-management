import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/luong';

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả phiếu lương
export const getAllPhieuLuong = () => axios.post(`${API_URL}/getAllPhieuLuong`, { token: getToken() });

// Lấy phiếu lương có lọc
export const getFilteredPhieuLuong = (filter) => axios.post(`${API_URL}/getFilteredPhieuLuong`, { ...filter, token: getToken() }); 