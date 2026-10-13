import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 p-4">
      <div className="text-center mb-4">
        <div className="brand-icon mx-auto mb-2" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
          <i className="bi bi-key-fill" />
        </div>
        <h3 className="fw-bold mb-1">Reset Password</h3>
        <p className="text-muted small">We'll send password recovery instructions to your email</p>
      </div>

      {sent ? (
        <div className="alert alert-success text-center">
          <i className="bi bi-check-circle fs-3 d-block mb-2" />
          Recovery link sent to <strong>{email}</strong>!
          <div className="mt-3">
            <Link to="/login" className="btn btn-outline-primary btn-sm">Return to Login</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Registered Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3">Send Reset Link</button>

          <div className="text-center small text-muted">
            Remember your password? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
          </div>
        </form>
      )}
    </div>
  );
}
