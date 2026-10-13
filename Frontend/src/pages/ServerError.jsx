import React from 'react';
import { Link } from 'react-router-dom';

export default function ServerError() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-3">
      <h1 className="display-1 fw-bold text-danger mb-0" style={{ fontSize: '6rem' }}>500</h1>
      <h3 className="fw-bold mb-2">Internal Server Error</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
        Something went wrong on our end. Please try refreshing or return back to safety.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2">
        <i className="bi bi-arrow-left me-1" /> Return Home
      </Link>
    </div>
  );
}
