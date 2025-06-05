import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/chamcong';

// Lấy tất cả chấm công
export const getAllChamCong = () => axios.get(`${API_URL}/getAll`);

// Check-in
export const checkIn = (data) => axios.post(`${API_URL}/checkIn`, data);

// Check-out
export const checkOut = (data) => axios.post(`${API_URL}/checkOut`, data);

// Sửa chấm công
export const modifyChamCong = (data) => axios.put(`${API_URL}/modifierChamcong`, data); 