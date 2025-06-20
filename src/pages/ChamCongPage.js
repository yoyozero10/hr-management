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
  try {
    // Nếu timeString đã là định dạng HH:mm hoặc HH:mm:ss, trả về luôn
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
      return timeString.substring(0, 5); // Chỉ lấy HH:mm
    }
    
    // Nếu là ISO string hoặc date string khác, lấy phần time
    const match = timeString.toString().match(/\d{2}:\d{2}(:\d{2})?/);
    if (match) return match[0].substring(0, 5); // Chỉ lấy HH:mm
    
    return timeString;
  } catch (e) {
    console.error('Error formatting time:', e);
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
  try {
    // Chuyển về định dạng HH:mm nếu là HH:mm:ss
    const startTime = gioVao.substring(0, 5);
    const endTime = gioRa.substring(0, 5);
    
    // Tách giờ và phút
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);
    
    let start = h1 * 60 + m1; // Chuyển về phút
    let end = h2 * 60 + m2;
    
    // Nếu giờ ra nhỏ hơn giờ vào, cộng thêm 24 giờ (qua ngày)
    if (end < start) end += 24 * 60;
    
    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    return `${hours} giờ ${minutes} phút`;
  } catch (e) {
    console.error('Error calculating work hours:', e);
    return 'N/A';
  }
};

const ChamCongPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState('');
  
  // Lấy ngày hiện tại
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isUser = user?.role === 'user';

  // Kiểm tra trạng thái check-in/out của user trong ngày
  const todayRecord = data.find(record => 
    record.employeeId === user?.employeeId && 
    formatDate(record.ngay) === formatDate(new Date())
  );

  useEffect(() => {
    if (isUser && user?.employeeId) {
      setEmployeeId(user.employeeId);
      setSelectedDate(today);
    }
    fetchEmployees();
    fetchData();
  }, [isUser, user?.employeeId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Nếu là user, luôn lấy dữ liệu ngày hiện tại và theo employeeId của họ
      const dateToFetch = isUser ? today : selectedDate;
      const empIdToFetch = isUser ? user.employeeId : employeeId;

      if (isUser && !user?.employeeId) {
        setError('Không tìm thấy thông tin nhân viên!');
        setLoading(false);
        return;
      }
      
      console.log('Calling API with params:', {
        ngay: dateToFetch,
        employeeId: empIdToFetch
      });
      
      const res = await chamCongApi.getAllChamCong({
        ngay: dateToFetch,
        employeeId: empIdToFetch
      });
      
      if (!res.data || !Array.isArray(res.data.data)) {
        console.error('Invalid API response format:', res);
        setError('Dữ liệu trả về không đúng định dạng');
        setLoading(false);
        return;
      }

      let filteredData = res.data.data || [];
      console.log('Data received from API:', filteredData);
      
      // Map employee data
      const mappedData = filteredData.map(item => {
        const emp = employees.find(e => Number(e.id) === Number(item.employeeId ?? item.employeeid));
        return {
          ...item,
          employeeName: emp?.hoten || item.employeeName,
          gioVao: formatTime(item.gioVao),
          gioRa: formatTime(item.gioRa),
          soGioLam: calculateWorkHours(item.gioVao, item.gioRa)
        };
      });
      
      console.log('Final mapped data:', mappedData);
      setData(mappedData);
    } catch (e) {
      console.error('Error details:', e.response || e);
      setError(e.response?.data?.message || 'Không thể tải dữ liệu chấm công. Vui lòng thử lại sau!');
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
    fetchData();
  };

  const handleClearFilters = () => {
    if (!isUser) {
      setEmployeeId(0);
    }
    setSelectedDate(today);
    fetchData();
  };

  const handleCheckIn = async () => {
    if (!user?.employeeId) {
      setError('Không tìm thấy thông tin nhân viên!');
      return;
    }

    try {
      setCheckingStatus('checking-in');
      setError('');
      
      console.log('Calling check-in API for employee:', user.employeeId);
      const response = await chamCongApi.checkIn(user.employeeId);
      console.log('Check-in API response:', response);

      if (response.data?.success) {
        // Refresh data after successful check-in
        await fetchData();
      } else {
        setError(response.data?.message || 'Không thể check-in. Vui lòng thử lại sau!');
      }
    } catch (e) {
      console.error('Check-in error:', e.response || e);
      setError(e.response?.data?.message || 'Không thể check-in. Vui lòng thử lại sau!');
    } finally {
      setCheckingStatus('');
    }
  };

  const handleCheckOut = async () => {
    if (!user?.employeeId) {
      setError('Không tìm thấy thông tin nhân viên!');
      return;
    }

    try {
      setCheckingStatus('checking-out');
      setError('');
      
      console.log('Calling check-out API for employee:', user.employeeId);
      const response = await chamCongApi.checkOut(user.employeeId);
      console.log('Check-out API response:', response);

      if (response.data?.success) {
        // Refresh data after successful check-out
        await fetchData();
      } else {
        setError(response.data?.message || 'Không thể check-out. Vui lòng thử lại sau!');
      }
    } catch (e) {
      console.error('Check-out error:', e.response || e);
      setError(e.response?.data?.message || 'Không thể check-out. Vui lòng thử lại sau!');
    } finally {
      setCheckingStatus('');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Bảng chấm công</h2>
      
      {/* User view - Chỉ hiển thị trạng thái chấm công */}
      {isUser ? (
        <div style={{ 
          maxWidth: 600,
          margin: '0 auto',
          padding: 24,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            marginBottom: 24,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              margin: 0,
              marginBottom: 8,
              color: '#333'
            }}>
              Chấm công ngày {formatDate(new Date())}
            </h3>
            <div style={{ 
              fontSize: 16,
              color: '#666',
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 16
            }}>
              <div>
                <strong>Giờ vào:</strong>{' '}
                <span style={{ 
                  color: todayRecord?.gioVao ? '#2e7d32' : '#666'
                }}>
                  {todayRecord?.gioVao || '-- : --'}
                </span>
              </div>
              <div>
                <strong>Giờ ra:</strong>{' '}
                <span style={{ 
                  color: todayRecord?.gioRa ? '#2e7d32' : '#666'
                }}>
                  {todayRecord?.gioRa || '-- : --'}
                </span>
              </div>
              {todayRecord?.soGioLam && (
                <div>
                  <strong>Thời gian làm:</strong>{' '}
                  <span style={{ color: '#2e7d32' }}>
                    {todayRecord.soGioLam}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            marginTop: 24
          }}>
            <button
              onClick={handleCheckIn}
              disabled={checkingStatus !== '' || (todayRecord && todayRecord.gioVao)}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: (!checkingStatus && !todayRecord?.gioVao) ? '#4caf50' : '#e0e0e0',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: (!checkingStatus && !todayRecord?.gioVao) ? 'pointer' : 'not-allowed',
                minWidth: 140,
                fontSize: 16,
                transition: 'all 0.2s'
              }}
            >
              {checkingStatus === 'checking-in' ? 'Đang xử lý...' : 'Check-in'}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={checkingStatus !== '' || !todayRecord?.gioVao || todayRecord?.gioRa}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: (!checkingStatus && todayRecord?.gioVao && !todayRecord?.gioRa) ? '#f44336' : '#e0e0e0',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: (!checkingStatus && todayRecord?.gioVao && !todayRecord?.gioRa) ? 'pointer' : 'not-allowed',
                minWidth: 140,
                fontSize: 16,
                transition: 'all 0.2s'
              }}
            >
              {checkingStatus === 'checking-out' ? 'Đang xử lý...' : 'Check-out'}
            </button>
          </div>

          <div style={{
            marginTop: 24,
            textAlign: 'center',
            padding: '16px',
            borderRadius: 8,
            background: todayRecord?.gioRa ? '#e8f5e9' : (todayRecord?.gioVao ? '#fff3e0' : '#f5f5f5'),
            color: todayRecord?.gioRa ? '#2e7d32' : (todayRecord?.gioVao ? '#ef6c00' : '#666')
          }}>
            {todayRecord?.gioRa ? (
              'Đã hoàn thành chấm công hôm nay'
            ) : todayRecord?.gioVao ? (
              'Đã check-in, chưa check-out'
            ) : (
              'Chưa check-in hôm nay'
            )}
          </div>

          {error && (
            <div style={{ 
              marginTop: 16,
              padding: '12px 16px', 
              background: '#ffebee', 
              color: '#c62828', 
              borderRadius: 8,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
        </div>
      ) : (
        /* Admin view - Giữ nguyên giao diện cũ */
        <>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
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
            
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
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
        </>
      )}
    </div>
  );
};

export default ChamCongPage; 