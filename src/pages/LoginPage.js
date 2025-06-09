import React, { useState } from 'react';
import styled from 'styled-components';
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
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p>
          Welcome,<span>sign in to continue</span>
        </p>
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="oauthButton" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e3f0ff 0%, #f9f9f9 100%);
  .form {
    --background: #d3d3d3;
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 32px;
    background: var(--background);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 8px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    min-width: 340px;
  }
  .form > p {
    color: var(--font-color);
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }
  .form > p > span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }
  .form > input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }
  .form > input:focus {
    border-color: var(--input-focus);
  }
  .oauthButton {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 16px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .oauthButton:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .oauthButton::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: #212121;
    z-index: -1;
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }
  .oauthButton:hover {
    color: #e8e8e8;
  }
  .oauthButton:hover::before {
    width: 100%;
  }
  .error-message {
    color: red;
    text-align: center;
    width: 100%;
    font-size: 15px;
    font-weight: 500;
  }
`;

export default LoginPage; 