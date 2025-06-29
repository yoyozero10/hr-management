import React, { useEffect, useState } from 'react';
import { getAllNghiViec, approveNghiViec } from '../api/nghiviecApi';

const NghiViecPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAllNghiViec();
        setData(res.data);
      } catch (e) {
        setError('Lỗi khi tải dữ liệu nghỉ việc');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    setSuccessMsg('');
    setError('');
    try {
      await approveNghiViec(id);
      setSuccessMsg('Duyệt đơn thành công!');
      // Refresh data
      const res = await getAllNghiViec();
      setData(res.data);
    } catch (e) {
      setError('Duyệt đơn thất bại!');
    }
    setApprovingId(null);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Danh sách nghỉ việc</h2>
      <div style={{ marginBottom: 24, position: 'relative', maxWidth: 220 }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên nhân viên"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{
            padding: '8px 32px',
            borderRadius: 20,
            border: '2px solid #eee',
            width: '100%',
            fontSize: '14px',
            backgroundColor: '#f8f9fa',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
        />
        <span style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#666',
          fontSize: '14px'
        }}>🔍</span>
      </div>
      {loading && <div>Đang tải dữ liệu...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>ID</th>
              <th style={{ padding: '12px 8px' }}>Mã NV</th>
              <th style={{ padding: '12px 8px' }}>Họ tên</th>
              <th style={{ padding: '12px 8px' }}>Từ ngày</th>
              <th style={{ padding: '12px 8px' }}>Đến ngày</th>
              <th style={{ padding: '12px 8px' }}>Lý do</th>
              <th style={{ padding: '12px 8px' }}>Quyết định</th>
              <th style={{ padding: '12px 8px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(item =>
                !searchName || (item.hoten && item.hoten.toLowerCase().includes(searchName.toLowerCase()))
              )
              .sort((a, b) => a.id - b.id)
              .map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '10px 8px' }}>{item.id}</td>
                <td style={{ padding: '10px 8px' }}>{item.manv}</td>
                <td style={{ padding: '10px 8px' }}>{item.hoten}</td>
                <td style={{ padding: '10px 8px' }}>{item.tungay}</td>
                <td style={{ padding: '10px 8px' }}>{item.denngay}</td>
                <td style={{ padding: '10px 8px' }}>{item.lyDo}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 14px',
                      borderRadius: 12,
                      fontWeight: 600,
                      color:
                        item.quyetDinh?.toLowerCase().includes('đã duyệt') ? '#1a7f37' :
                        item.quyetDinh?.toLowerCase().includes('đang xét') ? '#1976d2' :
                        '#888',
                      background:
                        item.quyetDinh?.toLowerCase().includes('đã duyệt') ? '#d4f5e9' :
                        item.quyetDinh?.toLowerCase().includes('đang xét') ? '#e3edfd' :
                        '#f5f5f5',
                      fontSize: 14
                    }}
                  >
                    {item.quyetDinh}
                  </span>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={approvingId === item.id}
                    style={{
                      background: '#111',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 20px',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: approvingId === item.id ? 'not-allowed' : 'pointer',
                      opacity: approvingId === item.id ? 0.6 : 1
                    }}
                  >
                    {approvingId === item.id ? 'Đang duyệt...' : 'Duyệt'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NghiViecPage; 