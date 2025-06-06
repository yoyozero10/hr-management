import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    employeeId: '',
    roles: 'ADMIN',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('https://doanjava-z61i.onrender.com/api/auth/register', {
        username: form.username,
        password: form.password,
        email: form.email,
        employeeId: Number(form.employeeId),
        roles: [form.roles],
      });
      setSuccess('Tạo tài khoản admin thành công!');
      setForm({ username: '', password: '', email: '', employeeId: '', roles: 'ADMIN' });
    } catch (e) {
      setError('Đăng ký thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(120deg, #e3f0ff 0%, #f9f9f9 100%)'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18
      }}>
        <h2 style={{ margin: 0, textAlign: 'center' }}>Đăng ký Admin (tạm thời)</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Tên đăng nhập"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Mật khẩu"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          type="number"
          placeholder="Employee ID (ví dụ: 1)"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          name="roles"
          value={form.roles}
          onChange={handleChange}
          placeholder="Role (ADMIN)"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2962ff', color: '#fff', border: 'none', borderRadius: 6,
            padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer'
          }}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
      </form>
    </div>
  );
};

export default RegisterPage; 