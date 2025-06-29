import React, { useState, useEffect } from 'react';
import { addNghiViec, getAllNghiViecByUser } from '../api/nghiviecApi';
import { MdExitToApp } from 'react-icons/md';

const statusColor = (status) => {
  if (!status || status === '-') return { color: '#888', bg: '#f5f5f5', text: 'Đang chờ' };
  if (status.toLowerCase().includes('duyệt')) return { color: '#219653', bg: '#e6fff2', text: 'Đã duyệt' };
  if (status.toLowerCase().includes('từ chối') || status.toLowerCase().includes('không')) return { color: '#e53935', bg: '#ffeaea', text: 'Từ chối' };
  return { color: '#888', bg: '#f5f5f5', text: status };
};

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: 32,
  marginBottom: 32,
  maxWidth: 600,
  margin: '0 auto',
};

const labelStyle = {
  fontWeight: 600,
  color: '#1976d2',
  marginBottom: 6,
  fontSize: 16,
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: '1.5px solid #e0e0e0',
  fontSize: 16,
  marginBottom: 0,
  boxSizing: 'border-box',
};

const UserNghiViecPage = () => {
  const [form, setForm] = useState({
    tungay: '',
    denngay: '',
    lyDo: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await addNghiViec(form);
      setSuccess('Gửi đơn nghỉ việc thành công!');
      setForm({ tungay: '', denngay: '', lyDo: '' });
    } catch (e) {
      setError('Gửi đơn nghỉ việc thất bại!');
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      setErrorRequests('');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let userId = user?.id || user?.userId;
        userId = parseInt(userId, 10);
        if (!userId) throw new Error('Không tìm thấy userId');
        const res = await getAllNghiViecByUser(userId);
        setRequests(res.data);
      } catch (e) {
        setErrorRequests('Không tải được danh sách đơn nghỉ việc');
        console.error('Error fetching nghi viec:', e);
      }
      setLoadingRequests(false);
    };
    fetchRequests();
  }, [success]);

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: '32px 8px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto 28px auto', maxWidth: 600 }}>
        <MdExitToApp size={32} color="#1976d2" />
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700, fontSize: 28 }}>Gửi đơn nghỉ việc</h2>
      </div>
      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 0 }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={labelStyle}>Từ ngày</label>
              <input type="date" name="tungay" value={form.tungay} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={labelStyle}>Đến ngày</label>
              <input type="date" name="denngay" value={form.denngay} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Lý do</label>
            <textarea name="lyDo" value={form.lyDo} onChange={handleChange} required rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(25,118,210,0.10)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', width: '100%', marginTop: 8 }}>
            {loading ? 'Đang gửi...' : 'Gửi đơn'}
          </button>
        </form>
        {success && <div style={{ color: '#219653', marginTop: 18, fontWeight: 600, textAlign: 'center' }}>{success}</div>}
        {error && <div style={{ color: '#e53935', marginTop: 18, fontWeight: 600, textAlign: 'center' }}>{error}</div>}
      </div>
      {/* Danh sách đơn nghỉ việc */}
      <div style={{ ...cardStyle, marginTop: 24 }}>
        <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 18, fontSize: 22 }}>Lịch sử đơn nghỉ việc</h3>
        {loadingRequests ? (
          <div>Đang tải...</div>
        ) : errorRequests ? (
          <div style={{ color: '#e53935' }}>{errorRequests}</div>
        ) : requests.length === 0 ? (
          <div>Chưa có đơn nghỉ việc nào.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ background: '#f0f4fa' }}>
                  <th style={{ padding: 10, borderBottom: '2px solid #e0e0e0', textAlign: 'center' }}>Từ ngày</th>
                  <th style={{ padding: 10, borderBottom: '2px solid #e0e0e0', textAlign: 'center' }}>Đến ngày</th>
                  <th style={{ padding: 10, borderBottom: '2px solid #e0e0e0', textAlign: 'center' }}>Lý do</th>
                  <th style={{ padding: 10, borderBottom: '2px solid #e0e0e0', textAlign: 'center' }}>Quyết định</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item, idx) => {
                  return (
                    <tr key={item.id || idx}>
                      <td style={{ padding: 10, borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>{item.tungay}</td>
                      <td style={{ padding: 10, borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>{item.denngay}</td>
                      <td style={{ padding: 10, borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>{item.lyDo}</td>
                      <td style={{ padding: 10, borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>{item.quyetDinh || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNghiViecPage; 