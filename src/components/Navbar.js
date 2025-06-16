import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdGroups } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import Switch from './ThemeToggle';

const AccountMenu = ({ onLogout, username, showMenu }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 8
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <FaUserCircle size={32} color="#bbb" />
        <span style={{ background: '#e6fff2', color: '#1a7f37', borderRadius: 12, padding: '2px 12px', fontSize: 14, fontWeight: 500 }}>Online</span>
        <span style={{ fontSize: 18, marginLeft: 4 }}>▼</span>
      </div>
      
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 44,
            minWidth: 220,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            zIndex: 100,
            padding: '8px 0'
          }}
        >
          {showMenu && (
            <div style={{ padding: '12px 20px', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
              onClick={() => { setOpen(false); navigate('/thong-tin-ca-nhan'); }}
            >
              Tài khoản của tôi
              <div style={{ color: '#888', fontWeight: 400, fontSize: 13, marginTop: 2 }}>{username}</div>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 20px',
              color: '#e53935',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={onLogout}
          >
            <FiLogOut size={18} />
            Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ showMenu = true }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Lấy role từ token
  let roles = [];
  let username = '';
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      roles = decoded.roles || [];
      username = decoded.username || '';
    } catch (e) {}
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid #eee', background: '#fff', boxShadow: '0 2px 8px rgba(122,122,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #6a8dff 0%, #7f53ff 100%)',
            borderRadius: '12px',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(122, 122, 255, 0.12)'
          }}
        >
          <MdGroups size={26} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>
            Hệ thống Quản lý Nhân sự
          </div>
          <div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>
            Chào mừng {username ? username : 'bạn'} trở lại!
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {showMenu && <Switch />}
        <AccountMenu onLogout={handleLogout} username={username} showMenu={showMenu} />
      </div>
    </nav>
  );
};

export default Navbar;