import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/phongban';

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả phòng ban
export const getAllPhongBan = () => axios.get(`${API_URL}/getAll`);

// Lấy phòng ban theo ID
export const getPhongBanById = (id) => axios.get(`${API_URL}/getById/${id}`);

// Thêm phòng ban
export const addPhongBan = (data) => axios.post(`${API_URL}/addPhongban`, { ...data, token: getToken() });

// Sửa phòng ban
export const updatePhongBan = (id, data) => axios.put(`${API_URL}/updatePhongBan/${id}`, { ...data, token: getToken() });

// Xóa phòng ban
export const deletePhongBan = (id) => axios.delete(`${API_URL}/deletePhongBan/${id}`); 