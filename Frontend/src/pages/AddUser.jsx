import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddUser() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    team: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('User Created!');
  };

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-person-plus" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Management</p>
            <h1 className="h3 mb-1">Add User</h1>
            <p className="text-muted mb-0">Create a new user account with role and team assignments.</p>
          </div>
        </div>
        <div className="heading-actions">
          <Link className="btn btn-outline-secondary btn-sm" to="/users">
            <i className="bi bi-arrow-left me-1" aria-hidden="true" /> Back to Users
          </Link>
        </div>
      </div>

      <section className="row g-3">
        <div className="col-12 col-xl-8">
          <form className="panel needs-validation" onSubmit={handleSubmit}>
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-person-plus me-2" aria-hidden="true" />
                  <span>User Information</span>
                </h2>
                <p className="text-muted mb-0">Create a user account with validated fields.</p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="firstName">First name</label>
                <input
                  className="form-control"
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="lastName">Last name</label>
                <input
                  className="form-control"
                  id="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  className="form-control"
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input
                  className="form-control"
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  className="form-select"
                  id="role"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Choose role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="team">Team</label>
                <select
                  className="form-select"
                  id="team"
                  required
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                >
                  <option value="">Choose team</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Content">Content</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="notes">Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="4"
                  placeholder="Optional onboarding notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
              <Link className="btn btn-outline-secondary" to="/users">Cancel</Link>
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-person-check me-1" aria-hidden="true" /> Create User
              </button>
            </div>
          </form>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <h2 className="h5 mb-3 section-title">
              <i className="bi bi-list-check me-2" aria-hidden="true" />
              <span>Access Checklist</span>
            </h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot bg-primary" />
                <div>
                  <p className="mb-1 fw-semibold">Role-based access control</p>
                  <p className="text-muted small mb-0">Permissions are automatically mapped based on selected workspace role.</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot bg-success" />
                <div>
                  <p className="mb-1 fw-semibold">Email onboarding invitation</p>
                  <p className="text-muted small mb-0">An activation link will be sent to the user's email address.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
