import React from 'react';

const Navbar = () => (
  <nav style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #eee' }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 24 }}>Hệ thống Quản lý Nhân sự</div>
      <div style={{ fontSize: 14, color: '#888' }}>Chào mừng bạn trở lại!</div>
    </div>
    <div>
      <span style={{ color: 'green', border: '1px solid #0c0', borderRadius: 12, padding: '2px 10px', marginRight: 16, fontSize: 13 }}>Online</span>
      <span style={{ background: '#4285f4', color: '#fff', borderRadius: '50%', padding: '8px 14px', fontWeight: 700 }}>A</span>
    </div>
  </nav>
);

export default Navbar; 