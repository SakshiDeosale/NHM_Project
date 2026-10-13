import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');

  const usersList = [
    { id: 1, name: 'Sarah Ahmed', email: 'sarah@example.com', role: 'Admin', team: 'Operations', status: 'Active', badge: 'success', joined: 'Jan 12, 2026', avatar: '/assets/images/avatar/avatar-1.jpg' },
    { id: 2, name: 'Rafi Khan', email: 'rafi@example.com', role: 'Manager', team: 'Sales', status: 'Active', badge: 'success', joined: 'Feb 03, 2026', avatar: '/assets/images/avatar/avatar-2.jpg' },
    { id: 3, name: 'Nadia Islam', email: 'nadia@example.com', role: 'Editor', team: 'Content', status: 'Pending', badge: 'warning', joined: 'Mar 18, 2026', avatar: '/assets/images/avatar/avatar-3.jpg' },
    { id: 4, name: 'Mina Torres', email: 'mina@example.com', role: 'Viewer', team: 'Finance', status: 'Suspended', badge: 'secondary', joined: 'Apr 07, 2026', avatar: '/assets/images/avatar/avatar-4.jpg' },
    { id: 5, name: 'Jon Oliver', email: 'jon@example.com', role: 'Analyst', team: 'Data', status: 'Active', badge: 'success', joined: 'Apr 22, 2026', avatar: '/assets/images/avatar/avatar-5.jpg' },
  ];

  const filteredUsers = usersList.filter((user) => {
    const query = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.team.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-people" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Management</p>
            <h1 className="h3 mb-1">Users</h1>
            <p className="text-muted mb-0">Review accounts, roles, account status, and team ownership.</p>
          </div>
        </div>
        <div className="heading-actions">
          <Link className="btn btn-outline-secondary btn-sm" to="/tables">
            <i className="bi bi-download me-1" aria-hidden="true" /> Export
          </Link>
          <Link className="btn btn-primary btn-sm ms-2" to="/add-user">
            <i className="bi bi-person-plus me-1" aria-hidden="true" /> Add User
          </Link>
        </div>
      </div>

      <section className="row g-3 mt-1" aria-label="User summary">
        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-primary">
            <div className="metric-top">
              <span className="metric-label">Total Users</span>
              <span className="metric-icon"><i className="bi bi-people" aria-hidden="true" /></span>
            </div>
            <div className="metric-value">8,742</div>
            <div className="metric-meta">
              <span className="text-success">+5.1%</span>
              <span>this month</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-success">
            <div className="metric-top">
              <span className="metric-label">Active</span>
              <span className="metric-icon"><i className="bi bi-check2-circle" aria-hidden="true" /></span>
            </div>
            <div className="metric-value">7,980</div>
            <div className="metric-meta">
              <span className="text-success">91%</span>
              <span>healthy accounts</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-warning">
            <div className="metric-top">
              <span className="metric-label">Pending</span>
              <span className="metric-icon"><i className="bi bi-hourglass-split" aria-hidden="true" /></span>
            </div>
            <div className="metric-value">184</div>
            <div className="metric-meta">
              <span className="text-warning">12</span>
              <span>need approval</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-danger">
            <div className="metric-top">
              <span className="metric-label">Suspended</span>
              <span className="metric-icon"><i className="bi bi-slash-circle" aria-hidden="true" /></span>
            </div>
            <div className="metric-value">38</div>
            <div className="metric-meta">
              <span className="text-danger">4</span>
              <span>flagged today</span>
            </div>
          </article>
        </div>
      </section>

      <section className="panel mt-3">
        <div className="panel-header">
          <div>
            <h2 className="h5 mb-1 section-title">
              <i className="bi bi-table me-2" aria-hidden="true" />
              <span>User List</span>
            </h2>
            <p className="text-muted mb-0">Search, review, and manage team member accounts.</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <input
              className="form-control form-control-sm table-search"
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />
            <Link className="btn btn-primary btn-sm" to="/add-user">
              <i className="bi bi-person-plus me-1" aria-hidden="true" /> Add User
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Role</th>
                <th scope="col">Team</th>
                <th scope="col">Status</th>
                <th scope="col">Joined</th>
                <th scope="col" className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img className="avatar-img avatar-sm" src={u.avatar} alt={u.name} />
                        <div>
                          <p className="fw-semibold mb-0">{u.name}</p>
                          <p className="text-muted small mb-0">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{u.role}</td>
                    <td>{u.team}</td>
                    <td><span className={`badge text-bg-${u.badge}`}>{u.status}</span></td>
                    <td>{u.joined}</td>
                    <td className="text-end">
                      <Link className="btn btn-light btn-sm" to="/user-details">View</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No users matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
