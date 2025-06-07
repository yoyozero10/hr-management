import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/chucvu';

export const getAllChucVu = () => axios.get(`${API_URL}/getAll`); 