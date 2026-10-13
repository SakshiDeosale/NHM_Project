import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-3">
      <h1 className="display-1 fw-bold text-primary mb-0" style={{ fontSize: '6rem' }}>404</h1>
      <h3 className="fw-bold mb-2">Page Not Found</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2">
        <i className="bi bi-house me-1" /> Back to Dashboard
      </Link>
    </div>
  );
}
