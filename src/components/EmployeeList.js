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
  padding: '8px 14px 8px 32px',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  fontSize: 15,
  width: 300,
  background: '#fafbfc',
  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\'%23999\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99c.41.41 1.09.41 1.5 0s.41-1.09 0-1.5l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\'/></svg>')",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '8px center',
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
  );

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
        <input
          style={searchInput}
          placeholder="Tìm kiếm nhân viên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={addBtn} onClick={openAddModal}>
          <span style={{fontSize: 20, marginRight: 6}}>+</span> Thêm nhân viên
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
                <span style={avatarStyle}>{getInitials(emp.hoten)}</span>
                {emp.hoten}
              </td>
              <td style={tdStyle}>{emp.tenpb || emp.phongban || ''}</td>
              <td style={tdStyle}>
                {
                  (() => {
                    // Lấy tên chức vụ từ danh sách chức vụ theo idcv
                    const chucvu = chucVus.find(c => String(c.id) === String(emp.idcv));
                    return chucvu ? chucvu.name : '';
                  })()
                }
              </td>
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