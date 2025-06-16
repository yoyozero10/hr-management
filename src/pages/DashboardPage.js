import React, { useState, useEffect } from 'react';
import { getAllChamCong } from '../api/chamcongApi';
import { getEmployees } from '../api/employeeApi';

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [chamCongData, setChamCongData] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(decoded);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (userInfo?.roles?.includes('user')) {
      fetchEmployeeData();
      fetchChamCongData();
    }
  }, [userInfo]);

  const fetchEmployeeData = async () => {
    try {
      const res = await getEmployees();
      const emp = res.data.data.find(e => String(e.id) === String(userInfo.employeeId));
      setEmployee(emp);
    } catch (e) {
      console.error('Error fetching employee data:', e);
    }
  };

  const fetchChamCongData = async () => {
    try {
      const res = await getAllChamCong();
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = res.data.data.find(
        record => String(record.employeeId) === String(userInfo.employeeId) && record.ngay === today
      );
      setChamCongData(todayRecord);
    } catch (e) {
      console.error('Error fetching attendance data:', e);
    }
  };

  if (userInfo?.roles?.includes('user')) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Thông tin chấm công hôm nay</h2>
        {employee && (
          <div style={{ marginBottom: 24, fontSize: 16 }}>
            <p><strong>Nhân viên:</strong> {employee.hoten}</p>
            <p><strong>Mã nhân viên:</strong> {employee.id}</p>
            <p><strong>Phòng ban:</strong> {employee.phongBan?.name || 'N/A'}</p>
            <p><strong>Chức vụ:</strong> {employee.chucVu?.name || 'N/A'}</p>
          </div>
        )}
        <div style={{ 
          background: '#fff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{ marginTop: 0 }}>Trạng thái chấm công</h3>
          {chamCongData ? (
            <>
              <p><strong>Giờ vào:</strong> {chamCongData.gioVao || 'Chưa check-in'}</p>
              <p><strong>Giờ ra:</strong> {chamCongData.gioRa || 'Chưa check-out'}</p>
              <p><strong>Trạng thái:</strong> {
                !chamCongData.gioVao ? 'Chưa check-in' :
                !chamCongData.gioRa ? 'Đang làm việc' :
                'Đã check-out'
              }</p>
            </>
          ) : (
            <p>Chưa có dữ liệu chấm công cho hôm nay</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <p>Chào mừng bạn đến với hệ thống quản lý nhân sự!</p>
    </div>
  );
};

export default DashboardPage; 