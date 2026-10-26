import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiFetch(
          'http://localhost:5000/api/auth/me',
          { signal: controller.signal }
        );

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            body.message || 'Failed to load profile.'
          );
        }

        const result = await response.json();

        if (!controller.signal.aborted) {
          setProfile(result.user);
        }
      } catch (err) {
        if (
          err.name !== 'AbortError' &&
          !controller.signal.aborted
        ) {
          setError(err.message || 'Unable to load profile.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="panel p-4">
        <p className="mb-0">Loading your profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="alert alert-warning">
        Profile information is unavailable.
      </div>
    );
  }

  const fullName =
    profile.fullName ||
    [
      profile.firstName,
      profile.middleName,
      profile.surname
    ].filter(Boolean).join(' ') ||
    profile.username ||
    'User';

  return (
    <>
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

      <section className="panel mt-3">
        <div className="panel-header">
          <h2 className="h5 mb-0 section-title">
            <i className="bi bi-person-vcard me-2"
              aria-hidden="true" />
            Profile Information
          </h2>
        </div>

        <div className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                minWidth: '80px',
                border: '2px solid #dee2e6'
              }}
            >
              <i className="bi bi-person-fill fs-1 text-secondary" />
            </div>

            <div>
              <h3 className="h5 mb-1">{fullName}</h3>
              <p className="text-muted mb-2">
                {profile.designation || '-'}
              </p>

              <span className={`badge ${profile.status === 'Active'
                  ? 'text-bg-success'
                  : 'text-bg-secondary'
                }`}>
                {profile.status || 'Unknown'}
              </span>
            </div>
          </div>

          <hr />

          <div className="row g-4 mt-1">
            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                User ID
              </label>
              <p className="fw-semibold mb-0">
                {profile.userId ?? '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Username
              </label>
              <p className="fw-semibold mb-0">
                {profile.username || '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Mobile Number
              </label>
              <p className="fw-semibold mb-0">
                {profile.mobile || '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Email Address
              </label>
              <p className="fw-semibold mb-0">
                {profile.email || '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Designation
              </label>
              <p className="fw-semibold mb-0">
                {profile.designation || '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                Circle
              </label>
              <p className="fw-semibold mb-0">
                {profile.circle || '-'}
              </p>
            </div>

            <div className="col-12 col-md-6">
              <label className="text-muted small mb-1">
                District
              </label>
              <p className="fw-semibold mb-0">
                {profile.district || '-'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
