import React, { useState, useEffect } from 'react';
import * as chamCongApi from '../api/chamcongApi';
import { useNavigate } from 'react-router-dom';

const UserChamCongPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingStatus, setCheckingStatus] = useState('');
  const [todayRecord, setTodayRecord] = useState({
    gioVao: '',
    gioRa: '',
    soGioLam: ''
  });
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!user?.role || user.role !== 'user') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  // Tính số giờ làm
  const calculateWorkHours = (gioVao, gioRa) => {
    if (!gioVao || !gioRa) return '';
    try {
      const start = new Date(`2000/01/01 ${gioVao}`);
      const end = new Date(`2000/01/01 ${gioRa}`);
      const diff = (end - start) / 1000 / 60; // Convert to minutes
      const hours = Math.floor(diff / 60);
      const minutes = Math.floor(diff % 60);
      return `${hours} giờ ${minutes} phút`;
    } catch (e) {
      return '';
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingStatus('checking-in');
      setError('');
      
      const response = await chamCongApi.checkIn();
      
      if (response.data?.success) {
        const gioVao = formatTime(response.data.data?.gioVao || new Date());
        setTodayRecord(prev => ({
          ...prev,
          gioVao
        }));
      } else {
        setError(response.data?.message || 'Không thể check-in. Vui lòng thử lại sau!');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể check-in. Vui lòng thử lại sau!');
    } finally {
      setCheckingStatus('');
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckingStatus('checking-out');
      setError('');
      
      const response = await chamCongApi.checkOut();
      
      if (response.data?.success) {
        const gioRa = formatTime(response.data.data?.gioRa || new Date());
        setTodayRecord(prev => {
          const newRecord = {
            ...prev,
            gioRa
          };
          if (newRecord.gioVao && newRecord.gioRa) {
            newRecord.soGioLam = calculateWorkHours(newRecord.gioVao, newRecord.gioRa);
          }
          return newRecord;
        });
      } else {
        setError(response.data?.message || 'Không thể check-out. Vui lòng thử lại sau!');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể check-out. Vui lòng thử lại sau!');
    } finally {
      setCheckingStatus('');
    }
  };

  // Format ngày hiện tại
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      padding: '32px 16px',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#1976d2',
          color: '#fff',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Chấm công</h2>
          <div style={{ fontSize: 16, opacity: 0.9 }}>
            {formatDate(new Date())}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#666' }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {/* Thời gian làm việc */}
              {todayRecord?.soGioLam && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: 24,
                  padding: 16,
                  background: '#e8f5e9',
                  borderRadius: 8,
                  color: '#2e7d32'
                }}>
                  <strong>Thời gian làm việc:</strong> {todayRecord.soGioLam}
                </div>
              )}

              {/* Nút check-in/out */}
              <div style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleCheckIn}
                  disabled={checkingStatus !== ''}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    background: !checkingStatus ? '#4caf50' : '#e0e0e0',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: !checkingStatus ? 'pointer' : 'not-allowed',
                    minWidth: 140,
                    fontSize: 16,
                    transition: 'all 0.2s'
                  }}
                >
                  {checkingStatus === 'checking-in' ? 'Đang xử lý...' : 'Check-in'}
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={checkingStatus !== ''}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    background: !checkingStatus ? '#f44336' : '#e0e0e0',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: !checkingStatus ? 'pointer' : 'not-allowed',
                    minWidth: 140,
                    fontSize: 16,
                    transition: 'all 0.2s'
                  }}
                >
                  {checkingStatus === 'checking-out' ? 'Đang xử lý...' : 'Check-out'}
                </button>
              </div>

              {/* Hiển thị lỗi */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChamCongPage; 