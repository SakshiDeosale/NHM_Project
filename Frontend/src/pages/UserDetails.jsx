import React from 'react';
import { Link } from 'react-router-dom';

export default function UserDetails() {
  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-person-lines-fill" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Management</p>
            <h1 className="h3 mb-1">User Details</h1>
            <p className="text-muted mb-0">Inspect account status, profile data, permissions, and recent activity.</p>
          </div>
        </div>
        <div className="heading-actions">
          <Link className="btn btn-outline-secondary btn-sm" to="/users">
            <i className="bi bi-arrow-left me-1" aria-hidden="true" /> Back to Users
          </Link>
          <Link className="btn btn-primary btn-sm ms-2" to="/add-user">
            <i className="bi bi-person-plus me-1" aria-hidden="true" /> Add User
          </Link>
        </div>
      </div>

      <section className="row g-3">
        <div className="col-12 col-xl-4">
          <div className="panel h-100 text-center profile-card">
            <div className="profile-cover">
              <img src="/assets/images/png/dasher-ui-bootstrap-5.jpg" alt="User workspace preview" />
            </div>
            <div className="profile-hero">
              <img className="avatar-img avatar-xl profile-photo" src="/assets/images/avatar/avatar-1.jpg" alt="Sarah Ahmed" />
              <h2 className="h5 mb-1 mt-2">Sarah Ahmed</h2>
              <p className="text-muted mb-3">Senior Administrator</p>
              <span className="badge text-bg-success px-3 py-2">Active Account</span>
            </div>
            <div className="info-list mt-4 text-start">
              <div><span>Email</span><strong>sarah@example.com</strong></div>
              <div><span>Phone</span><strong>+1 555 0184</strong></div>
              <div><span>Team</span><strong>Operations</strong></div>
              <div><span>Location</span><strong>New York, USA</strong></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="panel mb-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-shield-check me-2" aria-hidden="true" />
                  <span>Account Permissions</span>
                </h2>
                <p className="text-muted mb-0">Assigned role capabilities for workspace management.</p>
              </div>
            </div>
            <div className="row g-2 p-2">
              <div className="col-md-6"><i className="bi bi-check-circle-fill text-success me-2" />User & Team Management</div>
              <div className="col-md-6"><i className="bi bi-check-circle-fill text-success me-2" />Security & Policy Audit</div>
              <div className="col-md-6"><i className="bi bi-check-circle-fill text-success me-2" />Billing & Financial Reports</div>
              <div className="col-md-6"><i className="bi bi-check-circle-fill text-success me-2" />System Integration Controls</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-clock-history me-2" aria-hidden="true" />
                  <span>Activity Log</span>
                </h2>
                <p className="text-muted mb-0">Recent events triggered by Sarah Ahmed.</p>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Updated system security policy</div>
                  <small className="text-muted">Changed password policy settings</small>
                </div>
                <small className="text-muted">2 hours ago</small>
              </li>
              <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Invited new user Jon Oliver</div>
                  <small className="text-muted">Assigned Analyst role in Data team</small>
                </div>
                <small className="text-muted">Yesterday</small>
              </li>
              <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Exported Sales Performance report</div>
                  <small className="text-muted">Downloaded CSV report</small>
                </div>
                <small className="text-muted">3 days ago</small>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
