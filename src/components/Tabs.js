import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Dashboard' },
  { path: '/phongban', label: 'Phòng ban' },
  { path: '/nhanvien', label: 'Nhân viên' },
  { path: '/chamcong', label: 'Chấm công' },
  { path: '/luong', label: 'Lương' },
  { path: '/tuyendung', label: 'Tuyển dụng' },
  { path: '/danhgia', label: 'Đánh giá' },
];

const Tabs = () => (
  <div style={{
    display: 'flex',
    gap: 32,
    padding: '0 40px',
    borderBottom: '2px solid #f0f0f0',
    marginBottom: 18,
    background: '#fff',
    alignItems: 'center',
    minHeight: 56
  }}>
    {tabs.map(tab => (
      <NavLink
        key={tab.path}
        to={tab.path}
        end={tab.path === '/'}
        style={({ isActive, isPending }) => ({
          color: isActive ? '#222' : '#222',
          fontWeight: isActive ? 700 : 500,
          textDecoration: 'none',
          background: isActive ? '#f5f5f5' : 'none',
          borderRadius: isActive ? 12 : 0,
          padding: isActive ? '14px 28px' : '12px 20px',
          fontSize: 18,
          transition: 'all 0.2s',
          border: 'none'
        })}
        onMouseOver={e => {
          e.currentTarget.style.background = '#f5f5f5';
          e.currentTarget.style.color = '#222';
        }}
        onMouseOut={e => {
          if (!e.currentTarget.classList.contains('active')) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = '#222';
          }
        }}
      >
        {tab.label}
      </NavLink>
    ))}
  </div>
);

export default Tabs; 