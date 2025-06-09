import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/chucvu';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAllChucVu = () => axios.get(`${API_URL}/getAll`, { headers: authHeaders() }); 