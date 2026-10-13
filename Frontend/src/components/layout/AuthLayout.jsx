import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="auth-card-container w-100" style={{ maxWidth: '440px' }}>
        <Outlet />
      </div>
    </div>
  );
}
