import React, { useEffect, useState } from 'react';
import { getAllBaoHiem, getBaoHiemById, addBaoHiem, updateBaoHiem, deleteBaoHiem } from '../api/baoHiemApi';
import { getEmployees } from '../api/employeeApi';
import { MdEdit, MdDelete } from 'react-icons/md';

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
  const [form, setForm] = useState({ sobh: '', ngayCap: '', noiCap: '', noiKhamBenh: '', manv: '' });
  const [editId, setEditId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const searchBaoHiem = async () => {
      if (!searchId.trim()) {
        setSearchResult(null);
        setSearchError('');
        return;
      }
      
      setSearchLoading(true);
      setSearchError('');
      setSearchResult(null);
      try {
        const res = await getBaoHiemById(searchId);
        setSearchResult(res.data.data);
        if (!res.data.data) setSearchError('Không tìm thấy bảo hiểm với ID này.');
      } catch (e) {
        setSearchError('Không tìm thấy bảo hiểm với ID này.');
        setSearchResult(null);
      }
      setSearchLoading(false);
    };

    const debounceTimeout = setTimeout(searchBaoHiem, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchId]);

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

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.data || []);
    } catch (e) {
      // ignore
    }
  };

  const openAddModal = () => {
    setForm({ sobh: '', ngayCap: '', noiCap: '', noiKhamBenh: '', manv: '' });
    setModalType('add');
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      const res = await getBaoHiemById(id);
      setForm({
        sobh: res.data.data.sobh || '',
        ngayCap: res.data.data.ngayCap || '',
        noiCap: res.data.data.noiCap || '',
        noiKhamBenh: res.data.data.noiKhamBenh || '',
        manv: res.data.data.nhanVien?.id || ''
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
    const payload = {
      sobh: form.sobh,
      ngayCap: form.ngayCap,
      noiCap: form.noiCap,
      noiKhamBenh: form.noiKhamBenh,
      manv: Number(form.manv)
    };
    try {
      if (modalType === 'add') {
        await addBaoHiem(payload);
      } else if (modalType === 'edit') {
        await updateBaoHiem(editId, payload);
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
      {/* Search box */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          position: 'relative',
          maxWidth: 220,
          width: 'fit-content'
        }}>
          <input
            type="text"
            placeholder="Tìm kiếm bảo hiểm theo ID"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
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
        {searchLoading && <span style={{ marginLeft: 12 }}>Đang tìm...</span>}
      </div>
      {searchError && <div style={{ color: 'red', marginBottom: 12 }}>{searchError}</div>}
      {searchResult && (
        <div style={{ background: '#f8fafd', borderRadius: 8, padding: 18, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>Kết quả tìm kiếm:</h4>
          <div><b>ID:</b> {searchResult.idbh}</div>
          <div><b>Số BH:</b> {searchResult.sobh}</div>
          <div><b>Ngày cấp:</b> {searchResult.ngayCap}</div>
          <div><b>Nơi cấp:</b> {searchResult.noiCap}</div>
          <div><b>Nơi khám bệnh:</b> {searchResult.noiKhamBenh}</div>
          <div><b>Mã NV:</b> {searchResult.nhanVien?.id}</div>
          <div><b>Họ tên NV:</b> {searchResult.nhanVien?.hoten}</div>
        </div>
      )}
      <button 
        onClick={openAddModal} 
        style={{ 
          marginBottom: 16, 
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 20px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        Thêm mới
      </button>
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Số BH</th>
              <th style={thStyle}>Ngày cấp</th>
              <th style={thStyle}>Nơi cấp</th>
              <th style={thStyle}>Nơi khám bệnh</th>
              <th style={thStyle}>Mã NV</th>
              <th style={thStyle}>Họ tên NV</th>
              <th style={thStyle}>Ngày sinh</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.idbh}>
                <td style={tdStyle}>{row.idbh}</td>
                <td style={tdStyle}>{row.sobh}</td>
                <td style={tdStyle}>{row.ngayCap}</td>
                <td style={tdStyle}>{row.noiCap}</td>
                <td style={tdStyle}>{row.noiKhamBenh}</td>
                <td style={tdStyle}>{row.nhanVien?.id}</td>
                <td style={tdStyle}>{row.nhanVien?.hoten}</td>
                <td style={tdStyle}>{row.nhanVien?.ngaysinh}</td>
                <td style={tdStyle}>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#222',
                      fontSize: 20,
                      cursor: 'pointer',
                      marginRight: 8,
                      padding: 4,
                      borderRadius: 6,
                      transition: 'background 0.2s',
                    }}
                    title="Sửa"
                    onClick={() => openEditModal(row.idbh)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#e57373',
                      fontSize: 20,
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 6,
                      transition: 'background 0.2s',
                    }}
                    title="Xóa"
                    onClick={() => handleDelete(row.idbh)}
                  >
                    <MdDelete />
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
                <label>Số BH: </label>
                <input value={form.sobh} onChange={e => setForm({ ...form, sobh: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Ngày cấp: </label>
                <input type="date" value={form.ngayCap} onChange={e => setForm({ ...form, ngayCap: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Nơi cấp: </label>
                <input value={form.noiCap} onChange={e => setForm({ ...form, noiCap: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Nơi khám bệnh: </label>
                <input value={form.noiKhamBenh} onChange={e => setForm({ ...form, noiKhamBenh: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Nhân viên: </label>
                <select value={form.manv} onChange={e => setForm({ ...form, manv: e.target.value })} required>
                  <option value="">Chọn nhân viên</option>
                  {employees.map(emp => (
                    <option key={emp.id || emp.manv} value={emp.id || emp.manv}>
                      {emp.hoten} ({emp.id || emp.manv})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" style={{
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}>Lưu</button>
              <button type="button" onClick={() => setModalOpen(false)} style={{
                marginLeft: 8,
                border: '1px solid #ccc',
                borderRadius: 6,
                padding: '4px 12px',
                background: '#fff',
                color: '#222',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaoHiemPage; 