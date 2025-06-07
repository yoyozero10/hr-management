import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';
const getToken = () => localStorage.getItem('token') || '';

export const addDanhGia = ({ employeeId, ky, nam, diemSo, nhanXet }) =>
  axios.post(`${API_URL}/api/danhgia/addDanhGia`, {
    token: getToken(),
    employeeId,
    ky,
    nam,
    diemSo,
    nhanXet,
  });

export const getAllDanhGia = ({ employeeId = 0, ky = 0, nam = 0 } = {}) =>
  axios.post(`${API_URL}/api/danhgia/getAll`, {
    token: getToken(),
    employeeId,
    ky,
    nam,
  }); 