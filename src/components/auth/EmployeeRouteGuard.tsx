import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { store } from '../../lib/store';

export const EmployeeRouteGuard: React.FC = () => {
  const user = store.getCurrentUser();

  if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
    return <Navigate to="/employee/login" replace />;
  }

  return <Outlet />;
};
