import React, { useState, useEffect } from 'react';
import { getAllPhongBan, addPhongBan, updatePhongBan, deletePhongBan } from '../api/phongbanApi';
import { getEmployees } from '../api/employeeApi';

const PhongBanPage = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getAllPhongBan();
      console.log('Kết quả API getAllPhongBan:', res.data);
      if (Array.isArray(res.data.data)) {
        res.data.data.forEach((dep, idx) => console.log('Phòng ban', idx, dep));
      }
      setDepartments(res.data.data || []);
    } catch (e) {
      alert('Lỗi khi tải danh sách phòng ban!');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.data || []);
    } catch (e) {
      // Có thể alert hoặc bỏ qua
    }
  };

  const filtered = departments.filter(dep =>
    typeof dep.name === 'string' && dep.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa phòng ban này?')) return;
    try {
      await deletePhongBan(id);
      fetchDepartments();
    } catch (e) {
      alert('Lỗi khi xóa phòng ban!');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let data;
    if (editData.id) {
      data = { name: editData.name };
    } else {
      data = {
        name: editData.name,
        truongphong: editData.truongphong,
        soluongnv: Number(editData.soluongnv) || 0
      };
    }
    try {
      if (editData.id) {
        await updatePhongBan(editData.id, data);
      } else {
        await addPhongBan(data);
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (e) {
      alert('Lỗi khi lưu phòng ban!');
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Danh sách phòng ban</h2>
      <div style={{ display: 'flex', marginBottom: 18, gap: 16 }}>
        <input
          placeholder="Tìm kiếm phòng ban..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 220 }}
        />
        <button
          style={{
            background: '#2962ff', color: '#fff', border: 'none', borderRadius: 6,
            padding: '8px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer'
          }}
          onClick={() => { setEditData({ tenpb: '', truongphong: '', soluongnv: 0 }); setModalOpen(true); }}
        >
          Thêm phòng ban
        </button>
      </div>
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={{ width: '100%', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <thead>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Tên phòng ban</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Trưởng phòng</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Số nhân viên</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(dep => (
              <tr key={dep.id}>
                <td style={{ padding: 12 }}>{dep.name}</td>
                <td style={{ padding: 12 }}>{dep.truongphong || '-'}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{
                  employees.filter(emp => emp.phongBan && String(emp.phongBan.id) === String(dep.id)).length
                }</td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button onClick={() => { 
                    setEditData({
                      id: dep.id,
                      name: dep.name || '',
                      truongphong: dep.truongphong || '',
                      soluongnv: dep.soluongnv !== undefined ? dep.soluongnv : ''
                    });
                    setModalOpen(true); 
                  }} style={{ marginRight: 8 }}>Sửa</button>
                  <button onClick={() => handleDelete(dep.id)} style={{ color: '#e53935' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 10, padding: 32, minWidth: 350, boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
          }}>
            <h3>{editData.id ? 'Sửa phòng ban' : 'Thêm phòng ban'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 12 }}>
                <label>Tên phòng ban:</label><br />
                <input
                  value={editData.name || ''}
                  onChange={e => setEditData(ed => ({ ...ed, name: e.target.value }))}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Trưởng phòng:</label><br />
                <input
                  value={editData.truongphong}
                  onChange={e => setEditData(ed => ({ ...ed, truongphong: e.target.value }))}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Số nhân viên:</label><br />
                <input
                  type="number"
                  value={editData.soluongnv}
                  onChange={e => setEditData(ed => ({ ...ed, soluongnv: e.target.value }))}
                  min={0}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
                />
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ marginRight: 8 }}>Hủy</button>
                <button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhongBanPage; 