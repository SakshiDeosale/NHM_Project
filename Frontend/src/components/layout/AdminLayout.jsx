import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main">
        <Navbar />

        <main className="admin-content container-fluid px-3 px-lg-4 py-4">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}