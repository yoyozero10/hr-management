import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import ChamCongPage from './pages/ChamCongPage';
import UserChamCongPage from './pages/UserChamCongPage';
import LuongPage from './pages/LuongPage';
import TuyenDungPage from './pages/TuyenDungPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import PhongBanPage from './pages/PhongBanPage';
import DanhGiaPage from './pages/DanhGiaPage';
import BaoHiemPage from './pages/BaoHiemPage';
import Switch from './components/ThemeToggle';
import CurrentUserPage from './pages/CurrentUserPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  // Get user role from token
  let roles = [];
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      roles = decoded.roles || [];
    }
  } catch (e) {}

  const isUser = roles.includes('user');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#f5f6fa'
    }}>
      {!hideNav && <Navbar showMenu={!isUser} />}
      {!hideNav && !isUser && <Tabs />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/" element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/nhanvien" element={
            <PrivateRoute allowedRoles={['admin']}>
              <EmployeePage />
            </PrivateRoute>
          } />
          <Route path="/chamcong" element={
            <PrivateRoute allowedRoles={['admin']}>
              <ChamCongPage />
            </PrivateRoute>
          } />
          <Route path="/user-chamcong" element={
            <PrivateRoute allowedRoles={['user']}>
              <UserChamCongPage />
            </PrivateRoute>
          } />
          <Route path="/luong" element={
            <PrivateRoute allowedRoles={['admin']}>
              <LuongPage />
            </PrivateRoute>
          } />
          <Route path="/tuyendung" element={
            <PrivateRoute allowedRoles={['admin']}>
              <TuyenDungPage />
            </PrivateRoute>
          } />
          <Route path="/phongban" element={
            <PrivateRoute allowedRoles={['admin']}>
              <PhongBanPage />
            </PrivateRoute>
          } />
          <Route path="/danhgia" element={
            <PrivateRoute allowedRoles={['admin']}>
              <DanhGiaPage />
            </PrivateRoute>
          } />
          <Route path="/baohiem" element={
            <PrivateRoute allowedRoles={['admin']}>
              <BaoHiemPage />
            </PrivateRoute>
          } />
          <Route path="/thong-tin-ca-nhan" element={
            <PrivateRoute>
              <CurrentUserPage />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
