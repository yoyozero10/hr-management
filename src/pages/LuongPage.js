import React, { useEffect, useState } from 'react';
import { getAllPhieuLuong } from '../api/luongApi';

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

  useEffect(() => {
    fetchData();
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

  return (
    <div style={{ padding: 32 }}>
      <h2>Bảng lương</h2>
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mã phiếu</th>
              <th style={thStyle}>Mã NV</th>
              <th style={thStyle}>Tháng</th>
              <th style={thStyle}>Năm</th>
              <th style={thStyle}>Tổng lương</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                <td style={tdStyle}>{row.id || ''}</td>
                <td style={tdStyle}>{row.employeeId || ''}</td>
                <td style={tdStyle}>{row.thang || ''}</td>
                <td style={tdStyle}>{row.nam || ''}</td>
                <td style={tdStyle}>{row.tongLuong || row.tongluong || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LuongPage; 