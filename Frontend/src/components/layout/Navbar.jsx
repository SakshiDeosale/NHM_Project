import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';


export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar admin-navbar navbar-expand bg-white">
      <div className="container-fluid px-3 px-lg-4">
        <button
          className="sidebar-toggle"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        <form className="d-none d-md-flex align-items-center ms-3 me-auto search-form" role="search" onSubmit={(e) => e.preventDefault()}>

          <div className="navbar-center">

            {/* Maharashtra Government Logo */}
            <div className="header-logo">
              <img
                src="/assets/images/maharashtra_government_logo.png"
                alt="Maharashtra Government"
              />
            </div>

            {/* Center Text */}
            <div className="navbar-title">
              <div className="project-name">
                Smart Budget
                <br />
                Infrastructure Development Wing
              </div>

              <div className="designation">Superintending Engineer (IDW, NHM)

              </div>

            </div>

            {/* NHM Logo */}
            <div className="header-logo">
              <img
                src="/assets/images/NHM.jpg"
                alt="National Health Mission"
              />
            </div>

          </div>
        </form>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <button
            className="theme-toggle-btn btn btn-light rounded-circle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars'} />
          </button>

          <div className="dropdown">
            <button
              className="btn btn-light rounded-circle position-relative icon-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Notifications"
            >
              <i className="bi bi-bell" />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle notification-dot">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>
            <div className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 py-2 text-wrap navbar-dropdown">
              <h6 className="dropdown-header text-uppercase text-muted fw-bold">Notifications</h6>
              <Link className="dropdown-item py-2" to="/users">
                <div className="fw-semibold">New user registered</div>
                <small className="text-muted">5 minutes ago</small>
              </Link>
              <Link className="dropdown-item py-2" to="/settings">
                <div className="fw-semibold">System backup completed</div>
                <small className="text-muted">1 hour ago</small>
              </Link>
            </div>
          </div>

          <div className="dropdown">
            <button
              className="btn p-0 border-0 profile-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/assets/images/avatar/avatar.jpg"
                alt="Admin Hasan"
                className="avatar-img avatar-sm rounded-circle"
                width="36"
                height="36"
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
              <li className="px-3 py-2 border-bottom">
                <div className="fw-bold profile-name">Admin Hasan</div>
                <small className="text-muted">admin@example.com</small>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="/profile">
                  <i className="bi bi-person me-2" /> Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="/settings">
                  <i className="bi bi-gear me-2" /> Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link className="dropdown-item py-2 text-danger" to="/login">
                  <i className="bi bi-box-arrow-right me-2" /> Log out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
