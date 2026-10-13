import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 p-4">
      <div className="text-center mb-4">
        <div className="brand-icon mx-auto mb-2" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
          <i className="bi bi-person-plus-fill" />
        </div>
        <h3 className="fw-bold mb-1">Create Account</h3>
        <p className="text-muted small">Start managing your workspace today</p>
      </div>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3">Create Account</button>

        <div className="text-center small text-muted">
          Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
