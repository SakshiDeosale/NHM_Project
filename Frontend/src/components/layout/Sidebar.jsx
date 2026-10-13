import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

export default function Sidebar() {
  const { closeMobileSidebar } = useSidebar();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/users', label: 'Users', icon: 'bi-people' },
    { to: '/add-user', label: 'Add Admin', icon: 'bi-person-plus' },
    { to: '/profile', label: 'Profile', icon: 'bi-person-badge' },
    { to: '/charts', label: 'Charts', icon: 'bi-bar-chart-line' },
    { to: '/report', label: 'Report', icon: 'bi-file-earmark-text' },
    { to: '/forms', label: 'Master Forms', icon: 'bi-ui-checks-grid' },

    { to: '/settings', label: 'Settings', icon: 'bi-gear' },
    { to: '/privacy-policy', label: 'Privacy Policy', icon: 'bi-shield-lock' },
    { to: '/terms-conditions', label: 'Terms & Conditions', icon: 'bi-file-earmark-text' },

    { to: '/help', label: 'Help', icon: 'bi-question-circle' },
    { to: '/logout', label: 'Logout', icon: 'bi-box-arrow-right' }
  ];

  return (
    <>
      <div className="sidebar-backdrop" onClick={closeMobileSidebar} />

      <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
        <div className="sidebar-header">
          <NavLink className="brand-mark" to="/" onClick={closeMobileSidebar} aria-label="adminHMD dashboard">
            <span className="brand-icon">
              <img src="/assets/images/NHM.jpg" alt="NHM Logo" />
            </span>
            <span className="brand-copy">
              <span className="brand-title">Superintending Engineer</span>
              <span className="brand-subtitle">IDW</span>
            </span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileSidebar}
            >
              <span className="nav-icon">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
              </span>
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>
{/* 
        <div className="sidebar-user">
          <img
            className="avatar-img avatar-md sidebar-user-avatar"
            src="/assets/images/avatar/avatar.jpg"
            alt="Admin Hasan"
          />
          <strong>Admin Hasan</strong>
          <small>Active Workspace</small>
        </div> */}

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span className="sidebar-footer-text">System running smoothly</span>
        </div>
      </aside>
    </>
  );
}
