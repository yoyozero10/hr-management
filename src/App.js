import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import ChamCongPage from './pages/ChamCongPage';
import LuongPage from './pages/LuongPage';
import TuyenDungPage from './pages/TuyenDungPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import PhongBanPage from './pages/PhongBanPage';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideNav && <Navbar />}
      {!hideNav && <Tabs />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/nhanvien" element={
          <PrivateRoute>
            <EmployeePage />
          </PrivateRoute>
        } />
        <Route path="/chamcong" element={
          <PrivateRoute>
            <ChamCongPage />
          </PrivateRoute>
        } />
        <Route path="/luong" element={
          <PrivateRoute>
            <LuongPage />
          </PrivateRoute>
        } />
        <Route path="/tuyendung" element={
          <PrivateRoute>
            <TuyenDungPage />
          </PrivateRoute>
        } />
        <Route path="/phongban" element={
          <PrivateRoute>
            <PhongBanPage />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
