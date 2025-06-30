import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/nghiviec`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const addNghiViec = (payload) =>
  axios.post(`${API_URL}/addnghiviec`, payload, { headers: authHeaders() });

export const getAllNghiViecByUser = (userId) =>
  axios.get(`${API_URL}/getAllByUser`, { params: { userId }, headers: authHeaders() });

export const getAllNghiViec = () =>
  axios.get(`${API_URL}/getall`, { headers: authHeaders() });

export const approveNghiViec = (nghiViecId) =>
  axios.post(
    `${API_URL}/approve`,
    null,
    {
      params: { nghiViecId },
      headers: authHeaders()
    }
  );

export const rejectNghiViec = (nghiViecId, lido) => {
  return axios.post(
    `${API_BASE_URL}/nghiviec/decline`,
    null,
    {
      params: { nghiViecId, lido },
      headers: authHeaders()
    }
  );
}; 