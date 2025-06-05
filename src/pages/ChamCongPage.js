import React, { useEffect, useState } from 'react';
import { getAllChamCong } from '../api/chamcongApi';
import { getEmployees } from '../api/employeeApi';

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
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chamCongRes, empRes] = await Promise.all([
        getAllChamCong(),
        getEmployees()
      ]);
      setData(chamCongRes.data.data || []);
      setEmployees(empRes.data.data || []);
    } catch (e) {
      alert('Lỗi khi lấy dữ liệu');
      console.error(e);
    }
    setLoading(false);
  };

  // Tìm bản ghi chấm công theo mã nhân viên
  const findChamCong = (manv) => data.find(row => row.employeeId === manv || row.employeeId === String(manv));

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

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{marginBottom: 0}}>Bảng chấm công</h2>
      <div style={{color:'#888', marginBottom: 16}}>Dữ liệu chấm công ngày <b>05/06/2025</b></div>
      <div style={{
        background: '#fafbfc', borderRadius: 10, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24
      }}>
        <div>
          <div style={{fontWeight: 500, marginBottom: 4}}>Ngày</div>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
          />
        </div>
        <div>
          <div style={{fontWeight: 500, marginBottom: 4}}>Phòng ban</div>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            style={{padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
          >
            {departments.map(dep => (
              <option key={dep.value} value={dep.value}>{dep.label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{fontWeight: 500, marginBottom: 4}}>Tìm kiếm</div>
          <input
            type="text"
            placeholder="Tên nhân viên..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            style={{padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
          />
        </div>
        <button
          style={{
            background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 500, cursor: 'pointer', marginTop: 22
          }}
          onClick={() => {}} // Lọc realtime nên không cần làm gì
        >
          Áp dụng bộ lọc
        </button>
      </div>
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
              <th style={thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => {
              const chamCong = data.find(row => {
                if (row.employeeId !== (emp.manv || emp.id && String(row.employeeId) !== String(emp.manv || emp.id))) return false;
                if (filterDate) {
                  // So sánh ngày, chấp nhận cả timeStamp hoặc ngay
                  const rowDate = row.timeStamp || row.ngay;
                  return rowDate === filterDate;
                }
                return true;
              }) || {};
              const workingHours = calcWorkingHours(chamCong.gioVao, chamCong.gioRa);
              const status = getStatus(chamCong.gioVao, chamCong.gioRa);
              return (
                <tr key={emp.manv || emp.id || idx}>
                  <td style={tdStyle}>{emp.manv || emp.id}</td>
                  <td style={tdStyle}>{emp.hoten}</td>
                  <td style={tdStyle}>{chamCong.gioVao || '-'}</td>
                  <td style={tdStyle}>{chamCong.gioRa || '-'}</td>
                  <td style={tdStyle}>{workingHours}</td>
                  <td style={tdStyle}>{chamCong.loaicong || '-'}</td>
                  <td style={{...tdStyle, padding: 0}}>
                    <span style={badgeStyle(status.color, status.textColor)}>{status.label}</span>
                  </td>
                  <td style={tdStyle}>
                    <button style={{
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      padding: '4px 12px',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                      onClick={() => {
                        setEditData({
                          ...chamCong,
                          employee: emp,
                          gioVao: chamCong.gioVao || '',
                          gioRa: chamCong.gioRa || '',
                          loaicong: chamCong.loaicong || ''
                        });
                        setEditOpen(true);
                      }}
                    >Chỉnh sửa</button>
                  </td>
                </tr>
              );
            })}
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
            <div style={{marginBottom: 12}}><b>{editData?.employee?.hoten}</b> ({editData?.employee?.manv})</div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const body = {
                token: "",
                id: editData.id,
                employeeId: editData.employeeId,
                timeStamp: editData.ngay,
                gioVao: editData.gioVao,
                gioRa: editData.gioRa
              };
              try {
                await fetch('https://doanjava-z61i.onrender.com/api/chamcong/modifierChamcong', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body)
                });
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