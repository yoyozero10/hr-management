import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { jwtDecode } from 'jwt-decode';

function OAuth2RedirectHandler() {
  useEffect(() => {
    console.log("OAuth2RedirectHandler loaded");
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log("URL params:", params.toString());
    console.log("Token from URL:", token);

    const saveUserAndRedirect = async (token) => {
      try {
        console.log('Attempting to save user with token:', token);
        const res = await axios.post(`${API_BASE_URL}/auth/authentication`, { token });
        const user = res.data;
        console.log('Successfully got user data from backend:', user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (e) {
        console.error('Error saving user:', e);
        // fallback: decode user từ token nếu backend không trả user
        try {
          console.log('Attempting to decode token locally');
          const payload = jwtDecode(token);
          let appRole = '';
          if (payload.roles?.includes('ROLE_ADMIN')) appRole = 'admin';
          else if (payload.roles?.includes('ROLE_USER')) appRole = 'user';
          else if (payload.roles?.includes('ROLE_MANAGER')) appRole = 'manager';
          const user = { ...payload, role: appRole };
          console.log('Successfully decoded user from token:', user);
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }
        localStorage.setItem('token', token);
        return null;
      }
    };
    if (token && window.opener) {
      console.log('Found token and window.opener, proceeding with OAuth flow');
      saveUserAndRedirect(token).then((user) => {
        console.log('Sending message back to opener with token and user');
        window.opener.postMessage({ token, user }, window.location.origin);
        window.close();
      });
    } else if (token) {
      console.log('Found token but no window.opener');
      saveUserAndRedirect(token).then(() => {
        window.location.href = '/';
      });
    } else {
      console.error("No token found in URL, redirecting to login.");
      window.location.href = '/login';
    }
  }, []);

  return <div>Đang xác thực đăng nhập Google...</div>;
}

export default OAuth2RedirectHandler; 