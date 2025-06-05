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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        name="hoten"
        value={form.hoten}
        onChange={handleChange}
        placeholder="Họ tên"
        required
        style={{ marginRight: 8 }}
      />
      <input
        name="chucdanh"
        value={form.chucdanh}
        onChange={handleChange}
        placeholder="Chức danh"
        required
        style={{ marginRight: 8 }}
      />
      <select
        name="gioitinh"
        value={form.gioitinh}
        onChange={handleChange}
        required
        style={{ marginRight: 8 }}
      >
        <option value="">Giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      <input
        name="ngaysinh"
        value={form.ngaysinh}
        onChange={handleChange}
        placeholder="Ngày sinh (yyyy-mm-dd)"
        type="date"
        required
        style={{ marginRight: 8 }}
      />
      <input
        name="diachi"
        value={form.diachi}
        onChange={handleChange}
        placeholder="Địa chỉ"
        required
        style={{ marginRight: 8 }}
      />
      <input
        name="dienthoai"
        value={form.dienthoai}
        onChange={handleChange}
        placeholder="Điện thoại"
        required
        style={{ marginRight: 8 }}
      />
      <input
        name="cccd"
        value={form.cccd}
        onChange={handleChange}
        placeholder="CCCD"
        required
        style={{ marginRight: 8 }}
      />
      <input
        name="hinhanh"
        value={form.hinhanh}
        onChange={handleChange}
        placeholder="Link ảnh (nếu có)"
        style={{ marginRight: 8 }}
      />
      <input
        name="idpb"
        value={form.idpb}
        onChange={handleChange}
        placeholder="ID phòng ban"
        type="number"
        required
        style={{ marginRight: 8, width: 100 }}
      />
      <input
        name="idcv"
        value={form.idcv}
        onChange={handleChange}
        placeholder="ID chức vụ"
        type="number"
        required
        style={{ marginRight: 8, width: 100 }}
      />
      <input
        name="idtd"
        value={form.idtd}
        onChange={handleChange}
        placeholder="ID trình độ"
        type="number"
        required
        style={{ marginRight: 8, width: 100 }}
      />
      <button type="submit">{selected ? 'Cập nhật' : 'Thêm mới'}</button>
    </form>
  );
}

export default EmployeeForm; 