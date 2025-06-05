import React from 'react';
import { NavLink } from 'react-router-dom';

const Tabs = () => (
  <div style={{ display: 'flex', gap: 24, padding: '0 32px', borderBottom: '1px solid #eee', marginBottom: 16 }}>
    <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Dashboard</NavLink>
    <NavLink to="/nhanvien" style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Nhân viên</NavLink>
    <NavLink to="/chamcong" style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Chấm công</NavLink>
    <NavLink to="/luong" style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Lương</NavLink>
    <NavLink to="/tuyendung" style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Tuyển dụng</NavLink>
    <NavLink to="/danhgia" style={({ isActive }) => ({ color: isActive ? '#2962ff' : '#222', borderBottom: isActive ? '2px solid #2962ff' : 'none', padding: 8 })}>Đánh giá</NavLink>
  </div>
);

export default Tabs; 