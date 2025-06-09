import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/nhanvien';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy danh sách tất cả nhân viên
export const getEmployees = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() });

// Lấy thông tin 1 nhân viên theo ID
export const getEmployeeById = (id) => axios.get(`${API_URL}/getByID/${id}`, { headers: authHeaders() });

// Thêm nhân viên mới
export const addEmployee = (data) => axios.post(`${API_URL}/addnhanvien`, data, { headers: authHeaders() });

// Sửa thông tin nhân viên
export const updateEmployee = (id, data) => axios.put(`${API_URL}/updatenhanvien/${id}`, data, { headers: authHeaders() });

// Xóa nhân viên
export const deleteEmployee = (id) => axios.delete(`${API_URL}/deleteNhanvien/${id}`, { headers: authHeaders() }); 