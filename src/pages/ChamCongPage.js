import React, { useEffect, useState } from 'react';
import { getAllChamCong, modifyChamCong, checkIn, checkOut } from '../api/chamcongApi';
import { getEmployees } from '../api/employeeApi';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 16,
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};
const thStyle = {
  background: '#fafbfc',
  fontWeight: 700,
  padding: '10px 12px',
  borderBottom: '2px solid #eee',
  textAlign: 'center',
};
const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #f0f0f0',
  textAlign: 'center',
};

const badgeStyle = (bg, color) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 12,
  background: bg,
  color: color,
  fontWeight: 500,
  fontSize: 13,
  margin: 4
});

const ChamCongPage = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterName, setFilterName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchData();
  }, []);

  const fetchUserInfo = async () => {
    setUserLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/auth/api/auth/getcurrentUserInfor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(response.data.data);
    } catch (err) {
      setUserInfo(null);
    }
    setUserLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chamCongRes, empRes] = await Promise.all([
        getAllChamCong(),
        getEmployees()
      ]);
      console.log('Dữ liệu chấm công trả về:', chamCongRes.data);
      setData(chamCongRes.data.data || []);
      setEmployees(empRes.data.data || []);
    } catch (e) {
      alert('Lỗi khi lấy dữ liệu');
      console.error(e);
    }
    setLoading(false);
  };

  // Tìm bản ghi chấm công theo mã nhân viên và ngày lọc
  const findChamCong = (manv) => {
    return data.find(row => {
      const matchId = row.employeeId === manv || row.employeeId === String(manv);
      const matchDate = filterDate ? row.ngay === filterDate : true;
      return matchId && matchDate;
    });
  };

  // Tính số giờ làm
  const calcWorkingHours = (gioVao, gioRa) => {
    if (!gioVao || !gioRa) return '-';
    const [h1, m1] = gioVao.split(':').map(Number);
    const [h2, m2] = gioRa.split(':').map(Number);
    const diff = (h2 + m2/60) - (h1 + m1/60);
    return diff > 0 ? diff.toFixed(2) + 'h' : '-';
  };

  // Tính trạng thái
  const getStatus = (gioVao, gioRa) => {
    if (!gioVao && !gioRa) return { label: 'Vắng mặt', color: '#f8d7da', textColor: '#d32f2f' };
    if (gioVao > '08:30:00') return { label: 'Trễ', color: '#fff3cd', textColor: '#856404' };
    if (gioRa > '17:30:00') return { label: 'Làm thêm', color: '#e3f2fd', textColor: '#1976d2' };
    return { label: 'Đúng giờ', color: '#d4edda', textColor: '#388e3c' };
  };

  const uniqueDepartments = [
    ...new Set(employees.map(emp => emp.phongban).filter(Boolean))
  ];
  const departments = [{ value: 'all', label: 'Tất cả phòng ban' }, ...uniqueDepartments.map(dep => ({ value: dep, label: dep }))];

  const filteredEmployees = employees.filter(emp => {
    if (filterDept !== 'all' && emp.phongban !== filterDept) return false;
    if (filterName && !emp.hoten.toLowerCase().includes(filterName.toLowerCase())) return false;
    return true;
  });

  // Lấy employeeId từ userInfo
  const employeeId = userInfo?.employeeId;
  console.log('employees:', employees);
  console.log('employeeId:', employeeId);
  const employee = employees.find(emp => String(emp.id) === String(employeeId));
  console.log('employee:', employee);
  console.log('userInfo:', userInfo);
  const today = new Date().toISOString().slice(0, 10);
  console.log('today:', today);
  console.log('data:', data);

  // Lấy bản ghi chấm công hôm nay
  const chamCong = data.find(row => (String(row.employeeId) === String(employeeId)) && row.ngay === today) || {};

  // Xử lý check-in
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await checkIn({ token, employeeId });
      fetchData();
    } catch (e) {
      alert('Check-in thất bại!');
    }
    setActionLoading(false);
  };

  // Xử lý check-out
  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await checkOut({ token, employeeId });
      fetchData();
    } catch (e) {
      alert('Check-out thất bại!');
    }
    setActionLoading(false);
  };

  if (userLoading) return <div>Đang tải thông tin người dùng...</div>;
  if (!employeeId) return <div>Không tìm thấy employeeId của bạn!</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{marginBottom: 0}}>Bảng chấm công</h2>
      {employee && (
        <div style={{ marginBottom: 24 }}>
          <div><b>Nhân viên:</b> {employee.hoten} ({employee.id})</div>
          <div><b>Ngày:</b> {today}</div>
          <div style={{ margin: '16px 0' }}>
            <button onClick={handleCheckIn} disabled={!!chamCong.gioVao || actionLoading} style={{ marginRight: 12, padding: '8px 20px', borderRadius: 6, background: '#388e3c', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: chamCong.gioVao ? 'not-allowed' : 'pointer' }}>Check-in</button>
            <button onClick={handleCheckOut} disabled={!chamCong.gioVao || !!chamCong.gioRa || actionLoading} style={{ padding: '8px 20px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: (!chamCong.gioVao || chamCong.gioRa) ? 'not-allowed' : 'pointer' }}>Check-out</button>
          </div>
        </div>
      )}
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mã NV</th>
              <th style={thStyle}>Họ tên</th>
              <th style={thStyle}>Giờ vào</th>
              <th style={thStyle}>Giờ ra</th>
              <th style={thStyle}>Số giờ làm</th>
              <th style={thStyle}>Loại công</th>
              <th style={thStyle}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {employee ? (
              <tr>
                <td style={tdStyle}>{employee.id}</td>
                <td style={tdStyle}>{employee.hoten}</td>
                <td style={tdStyle}>{chamCong.gioVao || '-'}</td>
                <td style={tdStyle}>{chamCong.gioRa || '-'}</td>
                <td style={tdStyle}>{chamCong.soGioLam || '-'}</td>
                <td style={tdStyle}>{chamCong.loaicong || '-'}</td>
                <td style={tdStyle}>{chamCong.gioVao && !chamCong.gioRa ? 'Đang làm' : chamCong.gioVao && chamCong.gioRa ? 'Hoàn thành' : 'Chưa chấm công'}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      )}
      {editOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 10, padding: 32, minWidth: 350, boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
          }}>
            <h3>Chỉnh sửa chấm công</h3>
            <div style={{marginBottom: 12}}><b>{editData?.employee?.hoten}</b> ({editData?.employee?.id})</div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Đảm bảo đúng định dạng cho API
              const token = localStorage.getItem('token');
              const id = Number(editData.id);
              const employeeId = Number(editData.employeeId);
              // timeStamp: lấy từ editData.ngay hoặc editData.timeStamp, format yyyy-MM-dd
              const timeStamp = (editData.ngay || editData.timeStamp || '').slice(0, 10);
              // gioVao/gioRa: luôn có dạng HH:mm:ss
              const gioVao = editData.gioVao && editData.gioVao.length === 5 ? editData.gioVao + ':00' : (editData.gioVao || '');
              const gioRa = editData.gioRa && editData.gioRa.length === 5 ? editData.gioRa + ':00' : (editData.gioRa || '');
              const body = {
                token,
                id,
                employeeId,
                timeStamp,
                gioVao,
                gioRa
              };
              try {
                await modifyChamCong(body);
                setEditOpen(false);
                fetchData();
              } catch (err) {
                alert('Lỗi khi cập nhật!');
              }
            }}>
              <div style={{marginBottom: 8}}>
                <label>Giờ vào: </label>
                <input
                  type="time"
                  value={editData?.gioVao ? editData.gioVao.slice(0,5) : ''}
                  onChange={e => setEditData(ed => ({ ...ed, gioVao: e.target.value.length === 5 ? e.target.value + ':00' : e.target.value }))}
                  required
                />
              </div>
              <div style={{marginBottom: 8}}>
                <label>Giờ ra: </label>
                <input
                  type="time"
                  value={editData?.gioRa ? editData.gioRa.slice(0,5) : ''}
                  onChange={e => setEditData(ed => ({ ...ed, gioRa: e.target.value.length === 5 ? e.target.value + ':00' : e.target.value }))}
                  required
                />
              </div>
              <div style={{marginTop: 16, textAlign: 'right'}}>
                <button type="button" onClick={() => setEditOpen(false)} style={{marginRight: 8}}>Hủy</button>
                <button type="submit">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamCongPage; 