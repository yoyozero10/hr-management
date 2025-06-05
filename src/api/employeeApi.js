import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/nhanvien';

// Lấy danh sách tất cả nhân viên
export const getEmployees = () => axios.get(`${API_URL}/getAll`);

// Lấy thông tin 1 nhân viên theo ID
export const getEmployeeById = (id) => axios.get(`${API_URL}/getByID/${id}`);

// Thêm nhân viên mới
export const addEmployee = (data) => axios.post(`${API_URL}/addnhanvien`, data);

// Sửa thông tin nhân viên
export const updateEmployee = (id, data) => axios.put(`${API_URL}/updatenhanvien/${id}`, data);

// Xóa nhân viên
export const deleteEmployee = (id) => axios.delete(`${API_URL}/deleteNhanvien/${id}`); 