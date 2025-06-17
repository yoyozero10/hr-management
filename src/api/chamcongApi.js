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
  try {
    // If time is already in correct format, return as is
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
    
    // If time is a date string, convert to HH:mm:ss
    const date = new Date(time);
    if (isNaN(date.getTime())) return null;
    
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    console.error('Error formatting time:', e);
    return null;
  }
}

// Lấy tất cả dữ liệu chấm công
export const getAllChamCong = (params = {}) => {
  return axios.get(
    `${API_URL}/getAll`,
    { 
      params: {
        ngay: params.ngay || new Date().toISOString().split('T')[0],
        employeeId: params.employeeId
      },
      headers: authHeaders() 
    }
  );
};

// Check-in
export const checkIn = (employeeId) => {
  return axios.post(
    `${API_URL}/checkIn`,
    { employeeId },
    { headers: authHeaders() }
  );
};

// Check-out
export const checkOut = (employeeId) => {
  return axios.post(
    `${API_URL}/checkOut`,
    { employeeId },
    { headers: authHeaders() }
  );
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