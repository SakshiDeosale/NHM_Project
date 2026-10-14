
import React from 'react';

export default function Profile() {
  // Static sample profile data
  const profile = {
    userID: 1,
    firstName: 'Rahul',
    middleName: 'Mahesh',
    surname: 'Patil',
    username: 'ExecutiveEngineerPune1',
    mobile: '9876543210',
    email: 'rahul.patil@example.com',
    designation: 'Executive Engineer',
    circle: 'Pune Circle',
    district: 'Pune',
    status: 'Active',
  };

  const fullName = [
    profile.firstName,
    profile.middleName,
    profile.surname,
  ].join(' ');

  return (
    <>
      {/* Page Heading */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i className="bi bi-person-circle" aria-hidden="true" />
          </span>

          <div>
            <h1 className="h3 mb-1">My Profile</h1>
            <p className="text-muted mb-0">
              View your personal and account information.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <section className="panel mt-3">
        <div className="panel-header">
          <h2 className="h5 mb-0 section-title">
            <i className="bi bi-person-vcard me-2" aria-hidden="true" />
            Profile Information
          </h2>
        </div>

        <div className="p-4">
          {/* Profile Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                minWidth: '80px',
                border: '2px solid #dee2e6',
              }}
            >
              <i className="bi bi-person-fill fs-1 text-secondary" />
            </div>

            <div>
              <h3 className="h5 mb-1">{fullName}</h3>
              <p className="text-muted mb-2">
                {profile.designation}
              </p>
              <span className="badge text-bg-success">
                {profile.status}
              </span>
            </div>
          </div>

          <hr />

          {/* Important Details */}
          <div className="row g-4 mt-1">
            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                User ID
              </label>
              <p className="fw-semibold mb-0">
                {profile.userID}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Username
              </label>
              <p className="fw-semibold mb-0">
                {profile.username}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Mobile Number
              </label>
              <p className="fw-semibold mb-0">
                {profile.mobile}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Email Address
              </label>
              <p className="fw-semibold mb-0">
                {profile.email}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Designation
              </label>
              <p className="fw-semibold mb-0">
                {profile.designation}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Circle
              </label>
              <p className="fw-semibold mb-0">
                {profile.circle}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                District
              </label>
              <p className="fw-semibold mb-0">
                {profile.district}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
