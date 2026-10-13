import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 p-4">
      <div className="text-center mb-4">
        <div className="brand-icon mx-auto mb-2" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
          <i className="bi bi-grid-1x2-fill" />
        </div>
        <h3 className="fw-bold mb-1">Welcome back</h3>
        <p className="text-muted small">Sign in to your adminHMD workspace</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label className="form-label fw-semibold">Password</label>
            <Link to="/forgot-password" className="small text-primary text-decoration-none">Forgot password?</Link>
          </div>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="remember" defaultChecked />
          <label className="form-check-label small" htmlFor="remember">Remember me on this browser</label>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3">Sign In</button>

        <div className="text-center small text-muted">
          Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
