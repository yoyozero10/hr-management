import axios from 'axios';

const API_BASE = 'https://doanjava-z61i.onrender.com/api/baohiem';

export const getAllBaoHiem = () => axios.get(`${API_BASE}/getAll`);
export const getBaoHiemById = (id) => axios.get(`${API_BASE}/getById/${id}`);
export const addBaoHiem = (data) => axios.post(`${API_BASE}/addBaoHiem`, data);
export const updateBaoHiem = (id, data) => axios.put(`${API_BASE}/updateBaoHiem/${id}`, data);
export const deleteBaoHiem = (id) => axios.delete(`${API_BASE}/deleteBaoHiem/${id}`); 