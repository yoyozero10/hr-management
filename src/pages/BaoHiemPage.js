import React, { useEffect, useState } from 'react';
import { getAllBaoHiem, getBaoHiemById, addBaoHiem, updateBaoHiem, deleteBaoHiem } from '../api/baoHiemApi';

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
const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000
};
const modalContentStyle = {
  background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, minHeight: 180
};

const BaoHiemPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [form, setForm] = useState({ ten: '', mucDong: '', ghiChu: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllBaoHiem();
      console.log('Dữ liệu bảo hiểm trả về:', res.data);
      setData(res.data.data || []);
    } catch (e) {
      alert('Lỗi khi lấy dữ liệu bảo hiểm');
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setForm({ ten: '', mucDong: '', ghiChu: '' });
    setModalType('add');
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      const res = await getBaoHiemById(id);
      setForm({
        ten: res.data.data.ten || '',
        mucDong: res.data.data.mucDong || '',
        ghiChu: res.data.data.ghiChu || ''
      });
      setModalType('edit');
      setEditId(id);
      setModalOpen(true);
    } catch (e) {
      alert('Không lấy được thông tin bảo hiểm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bảo hiểm này?')) return;
    try {
      await deleteBaoHiem(id);
      fetchData();
    } catch (e) {
      alert('Lỗi khi xóa bảo hiểm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await addBaoHiem(form);
      } else if (modalType === 'edit') {
        await updateBaoHiem(editId, form);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      alert('Lỗi khi lưu bảo hiểm');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Quản lý Bảo hiểm</h2>
      <button onClick={openAddModal} style={{ marginBottom: 16 }}>Thêm mới</button>
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Số ĐBH</th>
              <th style={thStyle}>Ngày cấp</th>
              <th style={thStyle}>Nơi cấp</th>
              <th style={thStyle}>Nơi khám bệnh</th>
              <th style={thStyle}>Mã NV</th>
              <th style={thStyle}>Họ tên NV</th>
              <th style={thStyle}>Giới tính</th>
              <th style={thStyle}>Ngày sinh</th>
              <th style={thStyle}>Điện thoại</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.idbh}>
                <td style={tdStyle}>{row.idbh}</td>
                <td style={tdStyle}>{row.sdbh}</td>
                <td style={tdStyle}>{row.ngayCap}</td>
                <td style={tdStyle}>{row.noiCap}</td>
                <td style={tdStyle}>{row.noiKhamBenh}</td>
                <td style={tdStyle}>{row.nhanVien?.id}</td>
                <td style={tdStyle}>{row.nhanVien?.hoten}</td>
                <td style={tdStyle}>{row.nhanVien?.gioitinh}</td>
                <td style={tdStyle}>{row.nhanVien?.ngaysinh}</td>
                <td style={tdStyle}>{row.nhanVien?.dienthoai}</td>
                <td style={tdStyle}>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#222',
                      fontSize: 18,
                      marginRight: 12,
                      cursor: 'pointer'
                    }}
                    title="Xem"
                  >
                    &#128065;
                  </button>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#222',
                      fontSize: 18,
                      marginRight: 12,
                      cursor: 'pointer'
                    }}
                    title="Sửa"
                    onClick={() => openEditModal(row.idbh)}
                  >
                    &#9998;
                  </button>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#e57373',
                      fontSize: 18,
                      cursor: 'pointer'
                    }}
                    title="Xóa"
                    onClick={() => handleDelete(row.idbh)}
                  >
                    &#128465;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{modalType === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} bảo hiểm</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label>Tên bảo hiểm: </label>
                <input value={form.ten} onChange={e => setForm({ ...form, ten: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Mức đóng: </label>
                <input value={form.mucDong} onChange={e => setForm({ ...form, mucDong: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Ghi chú: </label>
                <input value={form.ghiChu} onChange={e => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setModalOpen(false)} style={{ marginLeft: 8 }}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaoHiemPage; 