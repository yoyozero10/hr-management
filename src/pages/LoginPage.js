import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://doanjava-z61i.onrender.com/api/auth/login', {
        username: form.username,
        password: form.password
      });
      // Giả sử backend trả về token ở res.data.token
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError('Đăng nhập thất bại!');
      }
    } catch (e) {
      setError('Sai tài khoản hoặc mật khẩu!');
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
        <h2 style={{ margin: 0, textAlign: 'center' }}>Đăng nhập Admin</h2>
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
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2962ff', color: '#fff', border: 'none', borderRadius: 6,
            padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer'
          }}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage; 