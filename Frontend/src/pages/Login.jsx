import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      if (!data.token || !data.user) {
        setError('Invalid response received from the server.');
        return;
      }

      // Store token and user according to Remember Me.
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));

        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      // Redirect based on the designation returned by the backend.
      const role = data.user.designation;

      const roleRoutes = {
        'Superintending Engineer': '/superintending-engineer',
        'Executive Engineer': '/executive-engineer',
        'Deputy Engineer': '/deputy-engineer',
        'Junior Engineer': '/junior-engineer',
        MLA: '/mla',
        MP: '/mp',
        Contractor: '/contractor',

        // Include this only if Senior Clerk is an authorized role.
        'Senior Clerk': '/unauthorized',
      };

      const destination = roleRoutes[role] || '/unauthorized';

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 p-4">
      <div className="text-center mb-4">
        <img
          src="/assets/images/NHM.jpg"
          alt="National Health Mission Logo"
          className="mb-3"
          style={{
            width: '65px',
            height: '65px',
            objectFit: 'contain',
          }}
        />

        <h3 className="fw-bold mb-1">Welcome to</h3>

        <h4 className="fw-bold mb-2">
          National Health Mission
        </h4>

        <p className="text-muted small">
          Sign in to your NHM Admin Dashboard
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label
            htmlFor="username"
            className="form-label fw-semibold"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            className="form-control"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="password"
            className="form-label fw-semibold"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <label
            className="form-check-label small"
            htmlFor="remember"
          >
            Remember me on this browser
          </label>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-semibold"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}