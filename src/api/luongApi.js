import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/luong';

// Lấy tất cả phiếu lương
export const getAllPhieuLuong = () => axios.post(`${API_URL}/getAllPhieuLuong`, {});

// Lấy phiếu lương có lọc
export const getFilteredPhieuLuong = (filter) => axios.post(`${API_URL}/getFilteredPhieuLuong`, filter); 