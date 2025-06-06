import React, { useState, useEffect } from 'react';
import { addEmployee, updateEmployee } from '../api/employeeApi';

function EmployeeForm({ selected, onSuccess }) {
  const [form, setForm] = useState({
    hoten: '',
    chucdanh: '',
    gioitinh: '',
    ngaysinh: '',
    diachi: '',
    dienthoai: '',
    cccd: '',
    hinhanh: '',
    idpb: 0,
    idcv: 0,
    idtd: 0,
  });

  useEffect(() => {
    if (selected) setForm(selected);
    else setForm({
      hoten: '',
      chucdanh: '',
      gioitinh: '',
      ngaysinh: '',
      diachi: '',
      dienthoai: '',
      cccd: '',
      hinhanh: '',
      idpb: 0,
      idcv: 0,
      idtd: 0,
    });
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (["idpb", "idcv", "idtd"].includes(name)) {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      hoten: form.hoten,
      gioitinh: form.gioitinh,
      ngaysinh: form.ngaysinh,
      dienthoai: form.dienthoai,
      cccd: form.cccd,
      diachi: form.diachi,
      hinhanh: form.hinhanh,
      idpb: form.idpb,
      idcv: form.idcv,
      idtd: form.idtd,
    };
    console.log('Dữ liệu gửi lên:', dataToSend);
    if (selected && (selected.id || selected.fid)) {
      await updateEmployee(selected.id || selected.fid, form);
    } else {
      await addEmployee(dataToSend);
    }
    onSuccess();
    setForm({
      hoten: '',
      chucdanh: '',
      gioitinh: '',
      ngaysinh: '',
      diachi: '',
      dienthoai: '',
      cccd: '',
      hinhanh: '',
      idpb: 0,
      idcv: 0,
      idtd: 0,
    });
  };

  const inputStyle = {
    width: '100%',
    minWidth: 180,
    maxWidth: 320,
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 15,
    marginTop: 4,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  };
  const labelStyle = {
    marginBottom: 8,
    fontWeight: 500
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      background: '#fff',
      borderRadius: 12,
      padding: 32
    }}>
      <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Họ tên</label>
          <input name="hoten" value={form.hoten} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Chức danh</label>
          <input name="chucdanh" value={form.chucdanh} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Giới tính</label>
          <select name="gioitinh" value={form.gioitinh} onChange={handleChange} required style={inputStyle}>
            <option value="">Giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Ngày sinh</label>
          <input name="ngaysinh" value={form.ngaysinh} onChange={handleChange} type="date" required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}>
        <div style={{ flex: 2, maxWidth: 600, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Địa chỉ</label>
          <input name="diachi" value={form.diachi} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Điện thoại</label>
          <input name="dienthoai" value={form.dienthoai} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>CCCD</label>
          <input name="cccd" value={form.cccd} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, marginBottom: 18 }}>
        <div style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Link ảnh (nếu có)</label>
          <input name="hinhanh" value={form.hinhanh} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ flex: 1, maxWidth: 200, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>ID phòng ban</label>
          <input name="idpb" value={form.idpb} onChange={handleChange} type="number" required style={inputStyle} />
        </div>
        <div style={{ flex: 1, maxWidth: 200, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>ID chức vụ</label>
          <input name="idcv" value={form.idcv} onChange={handleChange} type="number" required style={inputStyle} />
        </div>
        <div style={{ flex: 1, maxWidth: 200, display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>ID trình độ</label>
          <input name="idtd" value={form.idtd} onChange={handleChange} type="number" required style={inputStyle} />
        </div>
      </div>
      <button type="submit" style={{
        marginTop: 12,
        background: '#2962ff',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '12px 32px',
        fontWeight: 600,
        fontSize: 16,
        alignSelf: 'flex-end',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(41,98,255,0.08)'
      }}>
        {selected ? 'Cập nhật' : 'Thêm mới'}
      </button>
    </form>
  );
}

export default EmployeeForm; 