import React, { useState } from 'react';
import EmployeeList from '../components/EmployeeList';

const EmployeePage = () => {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (emp) => setSelected(emp);
  const handleSuccess = () => {
    setSelected(null);
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: 32 }}>
      <EmployeeList onEdit={handleEdit} refresh={refresh} />
    </div>
  );
};

export default EmployeePage; 