import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/chamcong`;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Format time to HH:mm:ss
function formatTime(time) {
  if (!time) return null;
  // If time already has correct format, return as is
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  // If time has milliseconds, remove them
  return time.split('.')[0];
}

// Lấy tất cả chấm công
export const getAllChamCong = async () => {
  const response = await axios.get(`${API_URL}/getAll`, { headers: authHeaders() });
  // Format time in response data
  if (response.data?.data) {
    response.data.data = response.data.data.map(record => ({
      ...record,
      gioVao: formatTime(record.gioVao),
      gioRa: formatTime(record.gioRa)
    }));
  }
  return response;
};

// Check-in
export const checkIn = async (data) => {
  const response = await axios.post(`${API_URL}/checkIn`, data, { headers: authHeaders() });
  if (response.data?.data) {
    response.data.data = {
      ...response.data.data,
      gioVao: formatTime(response.data.data.gioVao),
      gioRa: formatTime(response.data.data.gioRa)
    };
  }
  return response;
};

// Check-out
export const checkOut = async (data) => {
  const response = await axios.post(`${API_URL}/checkOut`, data, { headers: authHeaders() });
  if (response.data?.data) {
    response.data.data = {
      ...response.data.data,
      gioVao: formatTime(response.data.data.gioVao),
      gioRa: formatTime(response.data.data.gioRa)
    };
  }
  return response;
};

// Sửa chấm công
export const modifyChamCong = async (data) => {
  const response = await axios.put(`${API_URL}/modifierChamcong`, data, { headers: authHeaders() });
  if (response.data?.data) {
    response.data.data = {
      ...response.data.data,
      gioVao: formatTime(response.data.data.gioVao),
      gioRa: formatTime(response.data.data.gioRa)
    };
  }
  return response;
}; 