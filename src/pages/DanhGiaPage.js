import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllDanhGia, addDanhGia } from '../api/danhgiaApi';
import { getEmployees } from '../api/employeeApi';
import { getAllPhongBan } from '../api/phongbanApi';
// TODO: Import API functions for Đánh giá when available

const statusBadge = (type, text) => {
  const map = {
    pending: { bg: '#e3edfd', color: '#2962ff' },
    passed: { bg: '#d4f5e9', color: '#1a7f37' },
    failed: { bg: '#fdeaea', color: '#d32f2f' },
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

const initialForm = {
  employeeId: '',
  diemSo: '',
  nhanXet: '',
  ky: '',
  nam: '',
};

const getPerformanceLevel = (diem) => {
  if (diem === undefined || diem === null || diem === '') return 'Chưa có';
  const d = parseFloat(diem);
  if (d >= 0 && d <= 49) return 'Kém';
  if (d >= 50 && d <= 69) return 'Trung bình';
  if (d >= 70 && d <= 79) return 'Khá';
  if (d >= 80 && d <= 89) return 'Tốt';
  if (d >= 90 && d <= 100) return 'Xuất sắc';
  return 'Chưa có';
};

const COLORS = ['#e57373', '#ffd54f', '#64b5f6', '#81c784', '#ba68c8'];
const PERFORMANCE_LABELS = ['Kém', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'];

const getPieData = (evaluations) => {
  const counts = { 'Kém': 0, 'Trung bình': 0, 'Khá': 0, 'Tốt': 0, 'Xuất sắc': 0 };
  evaluations.forEach(ev => {
    const level = getPerformanceLevel(ev.diemSo);
    if (counts[level] !== undefined) counts[level]++;
  });
  return PERFORMANCE_LABELS.map((label) => ({ name: label, value: counts[label] }));
};

const DanhGiaPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [phongbans, setPhongbans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Lấy user hiện tại từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isUser = user?.role === 'user';

  useEffect(() => {
    fetchAll();
    fetchPhongbans();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [empRes, evalRes] = await Promise.all([
        getEmployees(),
        getAllDanhGia({})
      ]);
      console.log('API getAllDanhGia trả về:', evalRes.data);
      setEmployees(empRes.data.data || []);
      setEvaluations((evalRes.data.data || []).map(ev => ({ ...ev })));
    } catch (e) {
      setAddError('Lỗi khi tải dữ liệu đánh giá hoặc nhân viên!');
    }
    setLoading(false);
  };

  const fetchPhongbans = async () => {
    try {
      const res = await getAllPhongBan();
      setPhongbans(res.data.data || []);
    } catch (e) {}
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    setAddSuccess('');
    try {
      await addDanhGia({
        employeeId: Number(form.employeeId),
        diemSo: Number(form.diemSo),
        nhanXet: form.nhanXet,
        ky: Number(form.ky),
        nam: Number(form.nam),
      });
      setAddSuccess('Thêm đánh giá thành công!');
      setForm(initialForm);
      fetchAll();
    } catch (e) {
      setAddError('Lỗi khi thêm đánh giá!');
    }
    setAdding(false);
  };

  // Map employeeId to hoten, phongban
  const getEmp = (id) => employees.find(emp => String(emp.id) === String(id)) || {};

  const filteredEvaluations = evaluations.filter(ev => {
    if (isUser && user?.id) {
      // Nếu là user thường, chỉ hiển thị đánh giá của chính mình
      if (String(ev.employeeId) !== String(user.id)) return false;
    }
    if (filterStatus !== 'all') {
      const level = getPerformanceLevel(ev.diemSo);
      if (filterStatus === 'Đạt' && level !== 'Tốt' && level !== 'Xuất sắc') return false;
      if (filterStatus === 'Chưa đạt' && (level === 'Tốt' || level === 'Xuất sắc')) return false;
    }
    const emp = getEmp(ev.employeeId);
    if (search && !(emp.hoten || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pieData = getPieData(evaluations);

  return (
    <div style={{ padding: 32 }}>
      {/* Biểu đồ hiệu suất */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 32 }}>
        <h3 style={{ margin: 0, marginBottom: 18 }}>Hiệu suất công việc</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {pieData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} người`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ margin: 0 }}>Bảng đánh giá nhân viên</h2>
        <div style={{ color: '#888', marginBottom: 24 }}>Tổng cộng {evaluations.length} đánh giá</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
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
            <option value="Đạt">Đạt</option>
            <option value="Chưa đạt">Chưa đạt</option>
          </select>
        </div>
        {/* Form thêm đánh giá */}
        {!isUser && (
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <select name="employeeId" value={form.employeeId} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}>
            <option value="">Chọn nhân viên</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.hoten}{emp.phongban ? ` (${emp.phongban})` : ''}</option>
            ))}
          </select>
          <input name="diemSo" value={form.diemSo} onChange={handleChange} placeholder="Điểm" type="number" step="0.1" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 100 }} />
          <input name="nhanXet" value={form.nhanXet} onChange={handleChange} placeholder="Nhận xét" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }} />
          <input name="ky" value={form.ky} onChange={handleChange} placeholder="Kỳ" type="number" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 80 }} />
          <input name="nam" value={form.nam} onChange={handleChange} placeholder="Năm" type="number" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 80 }} />
          <button type="submit" disabled={adding} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{adding ? 'Đang thêm...' : 'Thêm đánh giá'}</button>
          {addError && <span style={{ color: 'red', marginLeft: 12 }}>{addError}</span>}
          {addSuccess && <span style={{ color: 'green', marginLeft: 12 }}>{addSuccess}</span>}
        </form>
        )}
        {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Mã NV</th>
              <th style={{ padding: '12px 8px' }}>Họ tên</th>
              <th style={{ padding: '12px 8px' }}>Phòng ban</th>
              <th style={{ padding: '12px 8px' }}>Điểm</th>
              <th style={{ padding: '12px 8px' }}>Nhận xét</th>
              <th style={{ padding: '12px 8px' }}>Kỳ</th>
              <th style={{ padding: '12px 8px' }}>Năm</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((ev, idx) => {
              // Lấy thông tin nhân viên nếu có
              let maNV = ev.nhanVien?.id || ev.employeeId || ev.id || 'Không có';
              let hoTen = ev.nhanVien?.hoten || ev.hoten;
              let phongBan = (() => {
                if (ev.nhanVien?.idpb) {
                  const pb = phongbans.find(p => String(p.id) === String(ev.nhanVien.idpb));
                  return pb ? pb.tenpb || pb.name : ev.nhanVien.idpb;
                }
                return ev.phongban;
              })();
              // Nếu không có nhanVien, tìm trong employees
              if (!hoTen || !phongBan) {
                const emp = employees.find(emp => String(emp.id) === String(ev.employeeId || ev.id));
                if (emp) {
                  hoTen = hoTen || emp.hoten;
                  phongBan = phongBan || emp.phongban;
                }
              }
              maNV = maNV || 'Không có';
              hoTen = hoTen || 'Không có';
              phongBan = phongBan || 'Không có';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' }}>
                  <td style={{ padding: '16px 8px' }}>{maNV}</td>
                  <td style={{ padding: '16px 8px' }}>{hoTen}</td>
                  <td style={{ padding: '16px 8px' }}>{phongBan}</td>
                  <td style={{ padding: '16px 8px' }}>{ev.diemSo}</td>
                  <td style={{ padding: '16px 8px' }}>{ev.nhanXet}</td>
                  <td style={{ padding: '16px 8px' }}>{ev.ky}</td>
                  <td style={{ padding: '16px 8px' }}>{ev.nam}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default DanhGiaPage; 