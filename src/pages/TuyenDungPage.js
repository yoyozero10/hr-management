import React, { useEffect, useState } from 'react';
import { getAllDangXetDuyet, addNewTuyenDung, acceptTuyenDung } from '../api/tuyenDungApi';

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
  const [searchInput, setSearchInput] = useState('');
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

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value); // Update search immediately when typing
  };

  const filteredCandidates = candidates.filter(c => {
    if (search && !(c.hoten || c.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ margin: 0 }}>Danh sách ứng viên</h2>
        <div style={{ color: '#888', marginBottom: 24 }}>Tổng cộng {candidates.length} ứng viên</div>
        {/* Form thêm ứng viên */}
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 32, marginBottom: 24, alignItems: 'flex-end', padding: '12px 0' }}>
          <input name="hoten" value={form.hoten} onChange={handleChange} placeholder="Họ tên" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input name="ngaysinh" value={form.ngaysinh} onChange={handleChange} placeholder="Ngày sinh" type="date" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input name="dienthoai" value={form.dienthoai} onChange={handleChange} placeholder="Điện thoại" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input name="vitri" value={form.vitri} onChange={handleChange} placeholder="Vị trí ứng tuyển" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="submit" disabled={adding} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer', width: '100%' }}>{adding ? 'Đang thêm...' : 'Thêm ứng viên'}</button>
            {addError && <span style={{ color: 'red', marginLeft: 12 }}>{addError}</span>}
          </div>
        </form>
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            position: 'relative',
            maxWidth: 220,
            width: 'fit-content'
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm ứng viên"
              value={searchInput}
              onChange={handleSearchChange}
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
            }}>
              🔍
            </span>
          </div>
        </div>
        {loading ? <div>Đang tải dữ liệu...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px', width: '25%' }}>Ứng viên</th>
              <th style={{ padding: '12px 8px', width: '20%' }}>Vị trí</th>
              <th style={{ padding: '12px 8px', width: '30%' }}>Liên hệ</th>
              <th style={{ padding: '16px 12px', width: '15%'}}>Trạng thái</th>
              <th style={{ padding: '16px 12px', width: '10%'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5', minHeight: 72 }}>
                <td style={{ padding: '20px 8px', verticalAlign: 'middle', display: 'flex', alignItems: 'center', gap: 12, width: '25%' }}>
                  <span style={{ background: '#f2f4f8', color: '#222', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{c.initials || (c.name ? c.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,3) : (c.hoten ? c.hoten.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,3) : ''))}</span>
                  <div>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{c.name || c.hoten}</div>
                    <div style={{ color: '#888', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{c.dob || c.ngaysinh}</div>
                  </div>
                </td>
                <td style={{ padding: '20px 8px', verticalAlign: 'middle', width: '20%' }}>{c.position || c.vitriungtuyen || c.vitri}</td>
                <td style={{ padding: '20px 8px', verticalAlign: 'middle', width: '30%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="phone">📞</span> {c.phone || c.sdt || c.dienthoai}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="email">✉️</span> {c.email}
                  </div>
                </td>
                <td style={{ padding: '20px 12px', verticalAlign: 'middle', width: '15%', textAlign: 'left' }}>
                  {statusBadge(getStatusType(c.status || c.trangthai), c.status || c.trangthai)}
                </td>
                <td style={{ padding: '20px 12px', verticalAlign: 'middle', width: '10%', textAlign: 'left' }}>
                  {getStatusType(c.status || c.trangthai) === 'pending' && (
                    <button
                      style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                      onClick={async () => {
                        try {
                          await acceptTuyenDung(c.id || c.candidateId);
                          fetchData();
                        } catch (e) {
                          alert('Lỗi khi duyệt ứng viên!');
                        }
                      }}
                    >
                      Duyệt
                    </button>
                  )}
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