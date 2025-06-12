import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, MdGroups, MdPerson, MdAccessTime, MdAttachMoney, MdSecurity, MdStar 
} from 'react-icons/md';
import { FaUserTie } from 'react-icons/fa';

const tabs = [
  { path: '/', label: 'Dashboard', icon: <MdDashboard />, roles: ['admin', 'user', 'manager'] },
  { path: '/phongban', label: 'Phòng ban', icon: <MdGroups />, roles: ['admin', 'manager'] },
  { path: '/nhanvien', label: 'Nhân viên', icon: <MdPerson />, roles: ['admin', 'manager'] },
  { path: '/chamcong', label: 'Chấm công', icon: <MdAccessTime />, roles: ['admin', 'user', 'manager'] },
  { path: '/luong', label: 'Lương', icon: <MdAttachMoney />, roles: ['admin', 'manager'] },
  { path: '/baohiem', label: 'Bảo hiểm', icon: <MdSecurity />, roles: ['admin', 'manager'] },
  { path: '/tuyendung', label: 'Tuyển dụng', icon: <FaUserTie />, roles: ['admin', 'user', 'manager'] },
  { path: '/danhgia', label: 'Đánh giá', icon: <MdStar />, roles: ['admin', 'user', 'manager'] },
];

const Tabs = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;
  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="tabs" style={{
      display: 'flex',
      gap: 21,
      padding: '0 40px',
      borderBottom: '2px solid #f0f0f0',
      marginBottom: 18,
      background: '#fff',
      alignItems: 'center',
      minHeight: 56
    }}>
      {visibleTabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) => isActive ? 'tab-active' : 'tab'}
          style={({ isActive }) => ({
            color: isActive ? '#222' : '#222',
            fontWeight: isActive ? 700 : 500,
            textDecoration: 'none',
            background: isActive ? '#f5f5f5' : 'none',
            borderRadius: isActive ? 12 : 0,
            padding: isActive ? '14px 28px' : '12px 20px',
            fontSize: 18,
            transition: 'all 0.2s',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          })}
          onMouseOver={e => {
            e.currentTarget.style.background = '#f5f5f5';
            e.currentTarget.style.color = '#222';
          }}
          onMouseOut={e => {
            if (!e.currentTarget.classList.contains('tab-active')) {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#222';
            }
          }}
        >
          {tab.icon}
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Tabs; 