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
    // Nếu time đã đúng định dạng, trả về nguyên bản
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) return time;
    
    // Nếu là ISO string hoặc date string, lấy giờ:phút từ chuỗi
    const timeStr = time.toString();
    const match = timeStr.match(/\d{2}:\d{2}(:\d{2})?/);
    if (match) return match[0];
    
    return null;
  } catch (e) {
    console.error('Error formatting time:', e);
    return null;
  }
}

// Lấy tất cả dữ liệu chấm công
export const getAllChamCong = (params = {}) => {
  // Prepare request parameters
  const requestParams = {
    ngay: params.ngay || new Date().toISOString().split('T')[0]
  };
  
  // Only add employId if it's defined and not 0
  if (params.employeeId !== undefined && params.employeeId !== 0) {
    requestParams.employId = params.employeeId;
  }
  
  return axios.get(
    `${API_URL}/getAll`,
    { 
      params: requestParams,
      headers: authHeaders() 
    }
  );
};

// Check-in
export const checkIn = () => {
  return axios.post(
    `${API_URL}/checkIn`,
    null,
    { headers: authHeaders() }
  );
};

// Check-out
export const checkOut = () => {
  return axios.post(
    `${API_URL}/checkOut`,
    null,
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