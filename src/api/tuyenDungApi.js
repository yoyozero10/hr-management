import axios from 'axios';

const API_URL = 'https://doanjava-z61i.onrender.com/api/tuyendung';

function getToken() {
  return localStorage.getItem('token');
}

// Lấy tất cả ứng viên theo JobId
export const getAllCandidatesByJobId = (jobId) => axios.post(`${API_URL}/getAllCandidatesByJobId`, { token: getToken(), jobId });

// Lấy tất cả ứng viên đang xét duyệt
export const getAllDangXetDuyet = () => axios.post(`${API_URL}/getAll-DangXetDuyet`, { token: getToken() });

// Thêm mới ứng viên tuyển dụng
export const addNewTuyenDung = (data) => axios.post(`${API_URL}/addNewTuyenDung`, { ...data, token: getToken() }); 