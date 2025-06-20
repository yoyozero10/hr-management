import React, { useState, useEffect } from 'react';
import { getAllChamCong } from '../api/chamcongApi';
import { getEmployees } from '../api/employeeApi';
import { getAllPhieuLuong } from '../api/luongApi';
import { getAllDangXetDuyet } from '../api/tuyenDungApi';
import { getAllDanhGia } from '../api/danhgiaApi';
import { MdGroups, MdAccessTime, MdAttachMoney, MdPersonAdd, MdStar, MdCalendarToday } from 'react-icons/md';
import { getCurrentMonthTotalSalary } from './LuongPage';

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [chamCongData, setChamCongData] = useState(null);
  const [employee, setEmployee] = useState(null);

  // Dữ liệu tổng quan cho admin/manager
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [newRecruitments, setNewRecruitments] = useState(0);
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [activities, setActivities] = useState([]);
  const today = new Date().toLocaleDateString('vi-VN');

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
    } else if (userInfo) {
      // Chỉ fetch tổng quan nếu không phải user thường
      fetchOverviewData();
    }
  }, [userInfo]);

  // Dành cho user thường
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

  // Dành cho admin/manager
  const fetchOverviewData = async () => {
    try {
      // Nhân viên
      const empRes = await getEmployees();
      setEmployees(empRes.data.data || []);

      // Chấm công hôm nay
      const chamCongRes = await getAllChamCong();
      const todayStr = new Date().toISOString().slice(0, 10);
      const chamCongList = chamCongRes.data.data || [];
      setAttendanceToday(chamCongList.filter(item => item.ngay === todayStr && item.gioVao).length);

      // Hoạt động gần đây (ví dụ: check-in gần nhất)
      setActivities(
        chamCongList
          .filter(item => item.gioVao)
          .slice(-5)
          .map(item => ({
            text: `Nhân viên ${item.employeeId} đã check-in lúc ${item.gioVao}`,
            time: item.gioVao
          }))
      );

      // Tổng lương tháng hiện tại
      const luongRes = await getAllPhieuLuong();
      const luongList = luongRes.data.data || [];
      const currentMonthSalary = getCurrentMonthTotalSalary(luongList);
      setTotalSalary(currentMonthSalary);

      // Tuyển dụng mới
      const tdRes = await getAllDangXetDuyet();
      setNewRecruitments((tdRes.data.data || []).length);

      // Hiệu suất trung bình
      const dgRes = await getAllDanhGia();
      const dgList = dgRes.data.data || [];
      if (dgList.length > 0) {
        const avg = dgList.reduce((sum, d) => sum + (d.diemSo || 0), 0) / dgList.length;
        setAvgPerformance(avg.toFixed(1));
      }
    } catch (e) {
      // Có thể thêm xử lý lỗi ở đây
    }
  };

  // Giao diện cho user thường
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

  // Giao diện cho admin/manager
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        <Card title="Tổng số nhân viên" value={employees.length} icon={<MdGroups size={28} />} />
        <Card title="Có mặt hôm nay" value={attendanceToday} icon={<MdAccessTime size={28} />} />
        <Card title="Tổng lương tháng" value={totalSalary.toLocaleString('vi-VN') + ' VNĐ'} icon={<MdAttachMoney size={28} />} />
        <Card title="Tuyển dụng mới" value={newRecruitments} icon={<MdPersonAdd size={28} />} />
        <Card title="Hiệu suất trung bình" value={avgPerformance + '/100'} icon={<MdStar size={28} />} />
        <Card title="Hôm nay" value={today} icon={<MdCalendarToday size={28} />} />
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 2, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3>Hoạt động gần đây</h3>
          <ul>
            {activities.map((act, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <span style={{ color: '#1976d2', fontWeight: 600 }}>•</span> {act.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon }) => (
  <div style={{
    flex: 1,
    minWidth: 220,
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
    <div style={{ fontSize: 15, color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon} {title}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#222' }}>{value}</div>
  </div>
);

const quickBtnStyle = {
  width: '100%',
  margin: '8px 0',
  padding: '12px 0',
  borderRadius: 8,
  border: 'none',
  background: '#f5f6fa',
  color: '#1976d2',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer'
};

export default DashboardPage; 