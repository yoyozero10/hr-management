import React, { useEffect, useState } from 'react';
import * as chamCongApi from '../api/chamcongApi';
import { getEmployees } from '../api/employeeApi';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  backgroundColor: '#f5f5f5',
  borderBottom: '2px solid #eee',
  fontWeight: 600,
  color: '#333'
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  color: '#444'
};

// Format thời gian
const formatTime = (timeString) => {
  if (!timeString) return '';
  // Nếu đúng định dạng HH:mm:ss thì trả về luôn
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) return timeString;
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString;
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    return timeString;
  }
};

// Format ngày
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

// Tính số giờ làm
const calculateWorkHours = (gioVao, gioRa) => {
  if (!gioVao || !gioRa) return 'N/A';
  // Nếu đúng định dạng HH:mm:ss thì tính toán thủ công
  if (/^\d{2}:\d{2}:\d{2}$/.test(gioVao) && /^\d{2}:\d{2}:\d{2}$/.test(gioRa)) {
    const [h1, m1, s1] = gioVao.split(':').map(Number);
    const [h2, m2, s2] = gioRa.split(':').map(Number);
    let start = h1 * 3600 + m1 * 60 + s1;
    let end = h2 * 3600 + m2 * 60 + s2;
    let diff = end - start;
    if (diff < 0) diff += 24 * 3600; // qua ngày
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours} giờ ${minutes} phút`;
  }
  // Nếu không đúng định dạng, trả về N/A
  return 'N/A';
};

const ChamCongPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(0);
  const [startDate, setStartDate] = useState('2024-06-15');
  const [endDate, setEndDate] = useState('');

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isUser = user?.role === 'user';

  useEffect(() => {
    if (isUser && user?.employeeId) {
      setEmployeeId(user.employeeId);
    }
    fetchEmployees();
    fetchData();
  }, [isUser, user?.employeeId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    if (!startDate) {
      setError('Vui lòng chọn ngày bắt đầu!');
      setLoading(false);
      return;
    }
    try {
      console.log('startDate:', startDate, 'endDate:', endDate);
      const params = {
        ngay: startDate,
        employeeId: employeeId
      };
      
      console.log('Params gửi lên API:', params);
      const res = await chamCongApi.getAllChamCong(params);
      console.log('Dữ liệu trả về từ API:', res.data);
      let filteredData = res.data.data || [];
      
      // Nếu là user thường, chỉ hiển thị chấm công của bản thân
      if (isUser && user?.employeeId) {
        filteredData = filteredData.filter(item => 
          String(item.employeeId) === String(user.employeeId)
        );
      }

      // Filter by date range if endDate is specified
      if (endDate) {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.ngay).setHours(0,0,0,0);
          const end = new Date(endDate).setHours(0,0,0,0);
          return itemDate <= end;
        });
      }
      
      // Map employee data
      const mappedData = filteredData.map(item => {
        const emp = employees.find(e => Number(e.id) === Number(item.employeeId ?? item.employeeid));
        console.log('Map:', item.employeeId ?? item.employeeid, emp);
        return {
          ...item,
          employeeName: emp?.hoten || item.employeeName,
          gioVao: formatTime(item.gioVao),
          gioRa: formatTime(item.gioRa),
          soGioLam: calculateWorkHours(item.gioVao, item.gioRa)
        };
      });
      
      setData(mappedData);
    } catch (e) {
      console.error('Lỗi khi lấy dữ liệu chấm công:', e);
      setError('Không thể tải dữ liệu chấm công. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      const empData = res.data.data || [];
      setEmployees(empData);
      console.log('Danh sách nhân viên:', empData);
      // Refresh data after getting employees to map names
      if (data.length > 0) {
        const mappedData = data.map(item => {
          const emp = empData.find(e => String(e.id) === String(item.employeeId));
          console.log('Map:', item.employeeId, emp);
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
      const res = await chamCongApi.getAllChamCong();
      let filteredData = res.data.data || [];
      
      // Filter by employee ID
      if (employeeId) {
        filteredData = filteredData.filter(item => 
          String(item.employeeId) === String(employeeId)
        );
      }

      // Filter by date range
      if (startDate) {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.ngay).setHours(0,0,0,0);
          const start = new Date(startDate).setHours(0,0,0,0);
          return itemDate >= start;
        });
      }

      if (endDate) {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.ngay).setHours(0,0,0,0);
          const end = new Date(endDate).setHours(0,0,0,0);
          return itemDate <= end;
        });
      }
      
      // Nếu là user thường, chỉ hiển thị chấm công của bản thân
      if (isUser && user?.employeeId) {
        filteredData = filteredData.filter(item => 
          String(item.employeeId) === String(user.employeeId)
        );
      }
      
      // Map employee data
      const mappedData = filteredData.map(item => {
        const emp = employees.find(e => Number(e.id) === Number(item.employeeId ?? item.employeeid));
        console.log('Map:', item.employeeId ?? item.employeeid, emp);
        return {
          ...item,
          employeeName: emp?.hoten || item.employeeName
        };
      });
      
      setData(mappedData);
    } catch (e) {
      console.error('Lỗi khi lọc dữ liệu chấm công:', e);
      setError('Không thể lọc dữ liệu chấm công. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  const handleClearFilters = () => {
    if (!isUser) {
      setEmployeeId(0);
    }
    setStartDate('2024-06-15');
    setEndDate('');
    fetchData();
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Bảng chấm công</h2>
      
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
          type="date"
          value={startDate}
          onChange={e => {
            console.log('Chọn ngày bắt đầu:', e.target.value);
            setStartDate(e.target.value);
          }}
          style={{ padding: 8, borderRadius: 6 }}
        />
        
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
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
                <th style={thStyle}>Mã NV</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Ngày</th>
                <th style={thStyle}>Giờ vào</th>
                <th style={thStyle}>Giờ ra</th>
                <th style={thStyle}>Số giờ làm</th>
                <th style={thStyle}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '32px 0', color: '#666' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{row.employeeId || ''}</td>
                    <td style={tdStyle}>{row.employeeName || ''}</td>
                    <td style={tdStyle}>{formatDate(row.ngay)}</td>
                    <td style={tdStyle}>{row.gioVao || ''}</td>
                    <td style={tdStyle}>{row.gioRa || ''}</td>
                    <td style={tdStyle}>{row.soGioLam || ''}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 14,
                        background: row.gioRa ? '#e8f5e9' : '#fff3e0',
                        color: row.gioRa ? '#2e7d32' : '#ef6c00'
                      }}>
                        {row.gioRa ? 'Đã check-out' : 'Chưa check-out'}
                      </span>
                    </td>
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

export default ChamCongPage; 