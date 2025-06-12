import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CurrentUserPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/auth/api/auth/getcurrentUserInfor`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('API getcurrentUserInfor response:', response.data);
        setUserInfo(response.data.data);
      } catch (err) {
        setError('Không thể lấy thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Thông tin nhân viên hiện tại</h2>
      {userInfo ? (
        <table>
          <tbody>
            {Object.entries(userInfo).map(([key, value]) => (
              <tr key={key}>
                <td style={{ fontWeight: 'bold', paddingRight: 16 }}>{key}</td>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

export default CurrentUserPage; 