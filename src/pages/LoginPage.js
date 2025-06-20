import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config';

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
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: form.username,
        password: form.password
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        // Giải mã JWT và lưu user với role chuẩn
        const payload = jwtDecode(token);
        let appRole = '';
        if (payload.roles?.includes('ROLE_ADMIN')) appRole = 'admin';
        else if (payload.roles?.includes('ROLE_USER')) appRole = 'user';
        else if (payload.roles?.includes('ROLE_MANAGER')) appRole = 'manager';
        const user = { ...payload, role: appRole };
        localStorage.setItem('user', JSON.stringify(user));
        console.log('PrivateRoute token:', token, 'user:', user);
        navigate('/');
      } else {
        setError('Đăng nhập thất bại!');
      }
    } catch (e) {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    const width = 500, height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    console.log('Opening Google login popup...');
    const popup = window.open(
      'https://doanjava-api-692954731682.asia-southeast1.run.app/oauth2/authorization/google',
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    console.log('Popup opened:', popup);
    
    window.addEventListener('message', (event) => {
      console.log('Received message event:', event);
      console.log('Event origin:', event.origin);
      console.log('Window origin:', window.location.origin);
      const allowedOrigins = [
        window.location.origin,
        'https://doanjava-api-692954731682.asia-southeast1.run.app'
      ];
      if (!allowedOrigins.includes(event.origin)) {
        console.log('Origin not allowed, ignoring message');
        return;
      }
      if (event.data.token) {
        console.log('Received token from popup');
        // Kiểm tra nếu token đến từ Google OAuth
        if (event.data.type === 'google-auth-token') {
          localStorage.setItem('token', event.data.token);
          // Decode token để lấy thông tin user
          try {
            const payload = jwtDecode(event.data.token);
            let appRole = '';
            if (payload.roles?.includes('ROLE_ADMIN')) appRole = 'admin';
            else if (payload.roles?.includes('ROLE_USER')) appRole = 'user';
            else if (payload.roles?.includes('ROLE_MANAGER')) appRole = 'manager';
            const user = { ...payload, role: appRole };
            localStorage.setItem('user', JSON.stringify(user));
          } catch (error) {
            console.error('Error decoding token:', error);
          }
          window.location.href = '/';
        }
      } else {
        console.log('No token in message data:', event.data);
      }
    }, { once: true });
  };

  return (
    <StyledWrapper>
      <LoginContainer>
        <LogoSection>
          <h1>HR Management</h1>
          <p>Nền tảng quản lý nhân sự toàn diện</p>
        </LogoSection>
        <FormSection>
          <FormCard>
            <FormHeader>
              <h2>Đăng nhập</h2>
              <p>Vui lòng đăng nhập để tiếp tục</p>
            </FormHeader>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <StyledForm onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="username">Tên đăng nhập</label>
                <StyledInput
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="password">Mật khẩu</label>
                <StyledInput
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <LoginButton type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </LoginButton>
              
              <Divider>
                <span>hoặc</span>
              </Divider>
              
              <GoogleButton type="button" onClick={handleGoogleLogin}>
                <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/1880px-Google_Favicon_2025.svg.png" alt="Google" />
                <span>Đăng nhập với Google</span>
              </GoogleButton>
            </StyledForm>
          </FormCard>
        </FormSection>
      </LoginContainer>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%, #ffffff 100%);
`;

const LoginContainer = styled.div`
  display: flex;
  width: 1000px;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 1024px) {
    width: 90%;
    flex-direction: column;
    height: auto;
  }
`;

const LogoSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  p {
    font-size: 1.2rem;
    text-align: center;
    max-width: 80%;
    opacity: 0.9;
  }
  
  @media (max-width: 1024px) {
    padding: 30px;
    
    h1 {
      font-size: 2rem;
    }
  }
`;

const FormSection = styled.div`
  flex: 1;
  background: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormHeader = styled.div`
  margin-bottom: 30px;
  
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #34495e;
  }
`;

const StyledInput = styled.input`
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const LoginButton = styled.button`
  height: 48px;
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(to right, #2980b9, #2471a3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }
  
  span {
    padding: 0 10px;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
`;

const GoogleButton = styled.button`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  span {
    margin-left: 8px;
  }
`;

const GoogleIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

export default LoginPage; 