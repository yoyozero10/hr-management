import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/tuyendung`;

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả ứng viên theo JobId
export const getAllCandidatesByJobId = (jobId) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/getAllCandidatesByJobId`,
    { jobId, token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Lấy tất cả ứng viên đang xét duyệt
export const getAllDangXetDuyet = () => {
  const token = getToken();
  return axios.get(
    `${API_URL}/getAll-DangXetDuyet`,
    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
  );
};

// Thêm mới ứng viên tuyển dụng
export const addNewTuyenDung = (data) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/addNewTuyenDung`,
    { ...data, token },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Duyệt ứng viên tuyển dụng
export const acceptTuyenDung = (candidateId) => {
  const token = getToken();
  return axios.post(
    `${API_URL}/accepttuyendung?candidateId=${candidateId}`,
    {},
    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
  );
}; 