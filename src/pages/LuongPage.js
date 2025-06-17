import React, { useEffect, useState } from 'react';
import { getAllPhieuLuong, getFilteredPhieuLuong, calculateSalary } from '../api/luongApi';
import { getEmployees } from '../api/employeeApi';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 16,
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};
const thStyle = {
  background: '#fafbfc',
  fontWeight: 700,
  padding: '10px 12px',
  borderBottom: '2px solid #eee',
  textAlign: 'center',
};
const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #f0f0f0',
  textAlign: 'center',
};

const ResultCard = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      width: '400px',
      maxWidth: '90%',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1976d2' }}>Kết quả tính lương</h3>
        <button 
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>
          {result.employeeName}
        </div>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
          Tháng {result.thang}/{result.nam}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '12px',
        fontSize: '15px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Lương cơ bản:</span>
          <span style={{ fontWeight: 500 }}>{formatCurrency(result.luongCoBan)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Bảo hiểm:</span>
          <span style={{ fontWeight: 500, color: '#d32f2f' }}>- {formatCurrency(result.baoHiem)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Phụ cấp:</span>
          <span style={{ fontWeight: 500, color: '#2e7d32' }}>+ {formatCurrency(result.phuCap)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '12px 0', 
          marginTop: '8px',
          borderTop: '2px solid #1976d2',
          fontWeight: 600,
          fontSize: '16px'
        }}>
          <span>Thực nhận:</span>
          <span style={{ color: '#1976d2' }}>{formatCurrency(result.thuNhapThuc)}</span>
        </div>
      </div>
    </div>
  );
};

// Hàm format tiền tệ
const formatCurrency = (value) => {
  if (!value || value === '0 VND') return '0 ₫';
  if (typeof value === 'string' && value.includes('VND')) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('VND', '₫');
};

const LuongPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(0);
  const [thang, setThang] = useState(0);
  const [nam, setNam] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isUser = user?.role === 'user';

  useEffect(() => {
    if (isUser && user?.employeeId) {
      setEmployeeId(user.employeeId);
    }
    fetchData();
    fetchEmployees();
  }, [isUser, user?.employeeId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllPhieuLuong();
      console.log('Dữ liệu phiếu lương nhận được:', res.data);
      let filteredData = res.data.data || [];
      
      // Nếu là user thường, chỉ hiển thị lương của bản thân
      if (isUser && user?.employeeId) {
        filteredData = filteredData.filter(item => 
          String(item.employeeId) === String(user.employeeId)
        );
      }
      
      // Map employee data
      const mappedData = filteredData.map(item => {
        const emp = employees.find(e => String(e.id) === String(item.employeeId));
        return {
          ...item,
          employeeName: emp?.hoten || item.employeeName
        };
      });
      
      setData(mappedData);
    } catch (e) {
      console.error('Lỗi khi lấy dữ liệu lương:', e);
      setError('Không thể tải dữ liệu lương. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      const empData = res.data.data || [];
      setEmployees(empData);
      
      // Refresh salary data after getting employees to map names
      if (data.length > 0) {
        const mappedData = data.map(item => {
          const emp = empData.find(e => String(e.id) === String(item.employeeId));
          return {
            ...item,
            employeeName: emp?.hoten || item.employeeName
          };
        });
        setData(mappedData);
      }
    } catch (e) {
      console.error('Lỗi khi lấy danh sách nhân viên:', e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const filter = {
        employeeId: employeeId || undefined,
        thang: thang || undefined,
        nam: nam || undefined
      };
      const res = await getFilteredPhieuLuong(filter);
      let filteredData = res.data.data || [];
      
      // Nếu là user thường, chỉ hiển thị lương của bản thân
      if (isUser && user?.employeeId) {
        filteredData = filteredData.filter(item => 
          String(item.employeeId) === String(user.employeeId)
        );
      }
      
      // Map employee data
      const mappedData = filteredData.map(item => {
        const emp = employees.find(e => String(e.id) === String(item.employeeId));
        return {
          ...item,
          employeeName: emp?.hoten || item.employeeName
        };
      });
      
      setData(mappedData);
    } catch (e) {
      console.error('Lỗi khi lọc dữ liệu lương:', e);
      setError('Không thể lọc dữ liệu lương. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  const handleCalculate = async () => {
    if (!employeeId || !thang || !nam) {
      setError('Vui lòng chọn đầy đủ nhân viên, tháng và năm để tính lương!');
      return;
    }
    
    setCalculating(true);
    setError('');
    setCalculationResult(null);
    try {
      console.log('Gửi yêu cầu tính lương với:', { employeeId, thang, nam });
      const res = await calculateSalary({
        employeeId: Number(employeeId),
        thang: Number(thang),
        nam: Number(nam)
      });
      
      console.log('Kết quả tính lương:', res.data);
      
      if (res.data && res.data.message === 'Success') {
        setCalculationResult(res.data.data);
        // Refresh data after calculation
        await fetchData();
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ server');
      }
      
    } catch (e) {
      console.error('Lỗi khi tính lương:', e);
      setError(e.response?.data?.message || 'Không thể tính lương. Vui lòng thử lại sau!');
    }
    setCalculating(false);
  };

  const handleClearFilters = () => {
    if (!isUser) {
      setEmployeeId(0);
    }
    setThang(0);
    setNam(0);
    fetchData();
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Bảng lương</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        {!isUser && (
          <select 
            value={employeeId} 
            onChange={e => setEmployeeId(Number(e.target.value))} 
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value={0}>Tất cả nhân viên</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.hoten}</option>
            ))}
          </select>
        )}
        
        <input
          type="number"
          min={1}
          max={12}
          placeholder="Tháng"
          value={thang === 0 ? '' : thang}
          onChange={e => setThang(Number(e.target.value) || 0)}
          style={{ padding: 8, borderRadius: 6, width: 80 }}
        />
        
        <input
          type="number"
          min={2000}
          max={2100}
          placeholder="Năm"
          value={nam === 0 ? '' : nam}
          onChange={e => setNam(Number(e.target.value) || 0)}
          style={{ padding: 8, borderRadius: 6, width: 100 }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: '#111', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 6, 
            padding: '8px 20px', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Đang tải...' : 'Tìm kiếm'}
        </button>

        {!isUser && (
          <button 
            type="button"
            onClick={handleCalculate}
            disabled={calculating || !employeeId || !thang || !nam}
            style={{ 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              padding: '8px 20px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: (calculating || !employeeId || !thang || !nam) ? 'not-allowed' : 'pointer',
              opacity: (calculating || !employeeId || !thang || !nam) ? 0.7 : 1
            }}
          >
            {calculating ? 'Đang tính...' : 'Tính lương'}
          </button>
        )}
        
        <button 
          type="button" 
          onClick={handleClearFilters}
          disabled={loading}
          style={{ 
            padding: '8px 20px', 
            borderRadius: 6, 
            background: '#eee', 
            color: '#222', 
            fontWeight: 600, 
            fontSize: 16, 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          Xóa lọc
        </button>
      </form>

      {error && (
        <div style={{ 
          padding: '12px 16px', 
          background: '#ffebee', 
          color: '#c62828', 
          borderRadius: 8, 
          marginBottom: 16 
        }}>
          {error}
        </div>
      )}

      {calculationResult && (
        <ResultCard 
          result={calculationResult} 
          onClose={() => setCalculationResult(null)} 
        />
      )}
      
      {loading ? (
        <div style={{ 
          padding: '32px 0', 
          textAlign: 'center', 
          color: '#666' 
        }}>
          Đang tải dữ liệu...
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Mã phiếu</th>
                <th style={thStyle}>Mã NV</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Tháng</th>
                <th style={thStyle}>Năm</th>
                <th style={thStyle}>Lương cơ bản</th>
                <th style={thStyle}>Bảo hiểm</th>
                <th style={thStyle}>Phụ cấp</th>
                <th style={thStyle}>Tổng lương</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '32px 0', color: '#666' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.luongId || idx}>
                    <td style={tdStyle}>{row.luongId || row.id || ''}</td>
                    <td style={tdStyle}>{row.employeeId || ''}</td>
                    <td style={tdStyle}>{row.employeeName || ''}</td>
                    <td style={tdStyle}>{row.thang || ''}</td>
                    <td style={tdStyle}>{row.nam || ''}</td>
                    <td style={tdStyle}>{formatCurrency(row.luongCoBan)}</td>
                    <td style={tdStyle}>{formatCurrency(row.baoHiem)}</td>
                    <td style={tdStyle}>{formatCurrency(row.phuCap)}</td>
                    <td style={tdStyle}>{formatCurrency(row.thuNhapThuc)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LuongPage; 