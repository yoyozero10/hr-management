import React, { useEffect, useState } from 'react';
import { getAllDangXetDuyet, addNewTuyenDung } from '../api/tuyenDungApi';

const statusBadge = (type, text) => {
  const map = {
    pending: { bg: '#e3edfd', color: '#2962ff' },
    interview: { bg: '#fff7d6', color: '#b59b00' },
    accepted: { bg: '#d4f5e9', color: '#1a7f37' },
    rejected: { bg: '#fdeaea', color: '#d32f2f' },
  };
  const style = {
    background: map[type]?.bg,
    color: map[type]?.color,
    padding: '2px 14px',
    borderRadius: 12,
    fontWeight: 500,
    fontSize: 14,
    display: 'inline-block',
  };
  return <span style={style}>{text}</span>;
};

function getStatusType(status) {
  if (!status) return 'pending';
  if (status.toLowerCase().includes('xét')) return 'pending';
  if (status.toLowerCase().includes('phỏng')) return 'interview';
  if (status.toLowerCase().includes('tuyển')) return 'accepted';
  if (status.toLowerCase().includes('từ chối')) return 'rejected';
  return 'pending';
}

const initialForm = {
  hoten: '',
  ngaysinh: '',
  dienthoai: '',
  email: '',
  vitri: '',
};

const TuyenDungPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllDangXetDuyet('string');
      setCandidates(res.data.data || []);
    } catch (e) {
      setError('Lỗi khi lấy danh sách ứng viên!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    setAddSuccess('');
    try {
      await addNewTuyenDung({
        token: 'string', // hoặc lấy token thực tế nếu có
        hoten: form.hoten,
        ngaysinh: form.ngaysinh,
        dienthoai: form.dienthoai,
        email: form.email,
        vitri: form.vitri,
      });
      setAddSuccess('Thêm ứng viên thành công!');
      setForm(initialForm);
      fetchData();
    } catch (e) {
      setAddError('Lỗi khi thêm ứng viên!');
    }
    setAdding(false);
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterStatus !== 'all' && (c.status || c.trangthai) !== filterStatus) return false;
    if (search && !(c.hoten || c.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ margin: 0 }}>Danh sách ứng viên</h2>
        <div style={{ color: '#888', marginBottom: 24 }}>Tổng cộng {candidates.length} ứng viên</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 220 }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang xét duyệt">Đang xét duyệt</option>
            <option value="Phỏng vấn">Phỏng vấn</option>
            <option value="Đã tuyển">Đã tuyển</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
        {/* Form thêm ứng viên */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <input name="hoten" value={form.hoten} onChange={handleChange} placeholder="Họ tên" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 160 }} />
          <input name="ngaysinh" value={form.ngaysinh} onChange={handleChange} placeholder="Ngày sinh" type="date" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140 }} />
          <input name="dienthoai" value={form.dienthoai} onChange={handleChange} placeholder="Điện thoại" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 120 }} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }} />
          <input name="vitri" value={form.vitri} onChange={handleChange} placeholder="Vị trí ứng tuyển" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 160 }} />
          <button type="submit" disabled={adding} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{adding ? 'Đang thêm...' : 'Thêm ứng viên'}</button>
          {addError && <span style={{ color: 'red', marginLeft: 12 }}>{addError}</span>}
          {addSuccess && <span style={{ color: 'green', marginLeft: 12 }}>{addSuccess}</span>}
        </form>
        {loading ? <div>Đang tải dữ liệu...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Ứng viên</th>
              <th style={{ padding: '12px 8px' }}>Vị trí</th>
              <th style={{ padding: '12px 8px' }}>Liên hệ</th>
              <th style={{ padding: '12px 8px' }}>Kinh nghiệm</th>
              <th style={{ padding: '12px 8px' }}>Ngày ứng tuyển</th>
              <th style={{ padding: '12px 8px' }}>Trạng thái</th>
              <th style={{ padding: '12px 8px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' }}>
                <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#f2f4f8', color: '#222', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{c.initials || (c.name ? c.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,3) : (c.hoten ? c.hoten.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,3) : ''))}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name || c.hoten}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{c.dob || c.ngaysinh}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 8px' }}>{c.position || c.vitriungtuyen || c.vitri}</td>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="phone">📞</span> {c.phone || c.sdt || c.dienthoai}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="email">✉️</span> {c.email}
                  </div>
                </td>
                <td style={{ padding: '16px 8px' }}>{c.exp || c.kinhnghiem}</td>
                <td style={{ padding: '16px 8px' }}>{c.applyDate || c.ngayungtuyen}</td>
                <td style={{ padding: '16px 8px' }}>{statusBadge(getStatusType(c.status || c.trangthai), c.status || c.trangthai)}</td>
                <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <button
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '4px 12px',
                        background: '#fff',
                        color: '#222',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                      title="Xem"
                    >
                      Xem
                    </button>
                    <button
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '4px 12px',
                        background: '#fff',
                        color: '#222',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                      title="Phỏng vấn"
                    >
                      Phỏng vấn
                    </button>
                    <button
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '4px 12px',
                        background: '#fff',
                        color: '#e57373',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default TuyenDungPage; 