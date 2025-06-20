import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../api/employeeApi';
import { getAllChucVu } from '../api/chucvuApi';

const tableWrapper = {
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: 24,
  margin: '24px auto',
  maxWidth: 1100,
};
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 8,
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
const avatarStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: '#e3e9f7',
  color: '#2d3a4a',
  fontWeight: 700,
  fontSize: 16,
  marginRight: 8,
};
const statusStyle = {
  display: 'inline-block',
  background: '#e6f9ed',
  color: '#1ca97a',
  borderRadius: 12,
  padding: '2px 14px',
  fontSize: 13,
  fontWeight: 500,
};
const actionBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  margin: '0 4px',
};
const topBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 18,
};
const searchInput = {
  padding: '8px 32px',
  borderRadius: 20,
  border: '2px solid #eee',
  width: '100%',
  fontSize: '14px',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.2s ease',
  outline: 'none'
};
const searchIconStyle = {
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#666',
  fontSize: '14px'
};
const searchContainerStyle = {
  position: 'relative',
  maxWidth: 220,
  width: 'fit-content'
};
const addBtn = {
  background: '#222',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const modalContent = {
  background: '#fff',
  borderRadius: 10,
  padding: 32,
  minWidth: 400,
  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
  position: 'relative',
};
const closeModalBtn = {
  position: 'absolute',
  top: 12,
  right: 18,
  background: 'none',
  border: 'none',
  fontSize: 22,
  cursor: 'pointer',
  color: '#888',
};

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

function EmployeeList({ onEdit, refresh }) {
  const [employees, setEmployees] = useState([]);
  const [chucVus, setChucVus] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [refreshLocal, setRefreshLocal] = useState(false);
  const [modalEmployee, setModalEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchChucVus();
    // eslint-disable-next-line
  }, [refresh, refreshLocal]);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      console.log('API getEmployees trả về:', res.data);
      setEmployees(res.data.data || []);
    } catch (error) {
      alert('Lỗi khi lấy danh sách nhân viên');
    }
  };

  const fetchChucVus = async () => {
    try {
      const res = await getAllChucVu();
      setChucVus(res.data.data || []);
    } catch (error) {
      // Có thể alert hoặc bỏ qua
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      await deleteEmployee(id);
      fetchEmployees();
    }
  };

  // Lọc nhân viên theo tên
  const filtered = employees.filter(emp =>
    emp.hoten && emp.hoten.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    // Lấy mã nhân viên (ưu tiên manv, sau đó id, cuối cùng là fid)
    const getEmployeeCode = (emp) => {
      const code = emp.manv || emp.id || emp.fid || '';
      // Nếu là số thì chuyển thành số để so sánh
      return isNaN(code) ? code : Number(code);
    };
    
    const codeA = getEmployeeCode(a);
    const codeB = getEmployeeCode(b);
    
    // So sánh và sắp xếp từ nhỏ đến lớn
    if (typeof codeA === 'number' && typeof codeB === 'number') {
      return codeA - codeB;
    }
    // Nếu là chuỗi thì so sánh chuỗi
    return String(codeA).localeCompare(String(codeB));
  });

  const openAddModal = () => setModalEmployee({});
  const openEditModal = (emp) => setModalEmployee(emp);
  const closeModal = () => setModalEmployee(null);

  function EmployeeModal() {
    // Import EmployeeForm tại đây để tránh vòng lặp import
    // eslint-disable-next-line
    const EmployeeForm = require('./EmployeeForm').default;
    const isEdit = modalEmployee && Object.keys(modalEmployee).length > 0;
    return (
      <div style={modalOverlay}>
        <div style={modalContent}>
          <button style={closeModalBtn} onClick={closeModal} title="Đóng">×</button>
          <h3 style={{marginTop:0}}>{isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
          <EmployeeForm selected={isEdit ? modalEmployee : null} onSuccess={() => { closeModal(); setRefreshLocal(!refreshLocal); }} />
        </div>
      </div>
    );
  }

  return (
    <div style={tableWrapper}>
      <div style={topBar}>
        <div style={searchContainerStyle}>
          <input
            style={searchInput}
            placeholder="Tìm kiếm nhân viên"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span style={searchIconStyle}>
            🔍
          </span>
        </div>
        <button style={addBtn} onClick={openAddModal}>
          Thêm nhân viên
        </button>
      </div>
      {modalEmployee !== null && <EmployeeModal />}
      <h2 style={{marginBottom: 0}}>Danh sách nhân viên</h2>
      <div style={{color: '#888', marginBottom: 12}}>Tổng cộng {filtered.length} nhân viên</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Mã NV</th>
            <th style={thStyle}>Họ tên</th>
            <th style={thStyle}>Phòng ban</th>
            <th style={thStyle}>Chức vụ</th>
            <th style={thStyle}>Điện thoại</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(emp => (
            <tr key={emp.fid || emp.id || emp.manv}>
              <td style={tdStyle}>{emp.fid || emp.id || emp.manv || ''}</td>
              <td style={{...tdStyle, textAlign: 'left'}}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {emp.hinhanh ? (
                    <img src={emp.hinhanh} alt={emp.hoten} style={{
                      ...avatarStyle,
                      objectFit: 'cover',
                      background: '#fff',
                      border: '2px solid #e3e9f7',
                      width: 36,
                      height: 36,
                      marginRight: 8
                    }} />
                  ) : (
                    <span style={avatarStyle}>{getInitials(emp.hoten)}</span>
                  )}
                  <span>{emp.hoten}</span>
                </span>
              </td>
              <td style={tdStyle}>{emp.phongBan?.name || ''}</td>
              <td style={tdStyle}>{emp.chucVu?.name || ''}</td>
              <td style={tdStyle}>{emp.dienthoai}</td>
              <td style={tdStyle}><span style={statusStyle}>Đang làm việc</span></td>
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
                  title="Sửa"
                  onClick={() => openEditModal(emp)}
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
                  onClick={() => handleDelete(emp.manv || emp.id || emp.fid)}
                >
                  &#128465;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList; 