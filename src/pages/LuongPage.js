import React, { useEffect, useState } from 'react';
import { getAllPhieuLuong, getFilteredPhieuLuong } from '../api/luongApi';
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

const LuongPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(0);
  const [thang, setThang] = useState(0);
  const [nam, setNam] = useState(0);

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllPhieuLuong();
      console.log('Dữ liệu phiếu lương nhận được:', res.data);
      setData(res.data.data || []);
    } catch (e) {
      alert('Lỗi khi lấy dữ liệu lương');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.data || []);
    } catch (e) {
      // ignore
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getFilteredPhieuLuong({ employeeId, thang, nam });
      setData(res.data.data || []);
    } catch (e) {
      alert('Lỗi khi lọc dữ liệu lương');
    }
    setLoading(false);
  };

  const handleClearFilters = () => {
    setEmployeeId(0);
    setThang(0);
    setNam(0);
    fetchData();
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Bảng lương</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <select value={employeeId} onChange={e => setEmployeeId(Number(e.target.value))} style={{ padding: 8, borderRadius: 6 }}>
          <option value={0}>Tất cả nhân viên</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.hoten}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={12}
          placeholder="Tháng"
          value={thang === 0 ? '' : thang}
          onChange={e => setThang(Number(e.target.value) || 0)}
          style={{ padding: 8, borderRadius: 6, width: 80 }}
        />
        <input
          type="number"
          min={2000}
          max={2100}
          placeholder="Năm"
          value={nam === 0 ? '' : nam}
          onChange={e => setNam(Number(e.target.value) || 0)}
          style={{ padding: 8, borderRadius: 6, width: 100 }}
        />
        <button type="submit" style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Tìm kiếm</button>
        <button type="button" onClick={handleClearFilters} style={{ padding: '8px 20px', borderRadius: 6, background: '#eee', color: '#222', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Xóa lọc</button>
      </form>
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mã phiếu</th>
              <th style={thStyle}>Mã NV</th>
              <th style={thStyle}>Họ tên</th>
              <th style={thStyle}>Giới tính</th>
              <th style={thStyle}>Tháng</th>
              <th style={thStyle}>Năm</th>
              <th style={thStyle}>Lương cơ bản</th>
              <th style={thStyle}>Bảo hiểm</th>
              <th style={thStyle}>Phụ cấp</th>
              <th style={thStyle}>Tổng lương</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.luongId || idx}>
                <td style={tdStyle}>{row.luongId || ''}</td>
                <td style={tdStyle}>{row.nhanVien?.id || ''}</td>
                <td style={tdStyle}>{row.nhanVien?.hoten || ''}</td>
                <td style={tdStyle}>{row.nhanVien?.gioitinh || ''}</td>
                <td style={tdStyle}>{row.thang || ''}</td>
                <td style={tdStyle}>{row.nam || ''}</td>
                <td style={tdStyle}>{row.luongCoBan || ''}</td>
                <td style={tdStyle}>{row.baoHiem || ''}</td>
                <td style={tdStyle}>{row.phuCap || ''}</td>
                <td style={tdStyle}>{row.thuNhapThuc || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LuongPage; 