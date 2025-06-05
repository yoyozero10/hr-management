import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import ChamCongPage from './pages/ChamCongPage';
import LuongPage from './pages/LuongPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Tabs />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/nhanvien" element={<EmployeePage />} />
        <Route path="/chamcong" element={<ChamCongPage />} />
        <Route path="/luong" element={<LuongPage />} />
      </Routes>
    </Router>
  );
}

export default App;
