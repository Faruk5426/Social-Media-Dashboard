import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-showcase">
        <div className="auth-brand"><span className="dot" />Pulse</div>
        <h1 className="auth-headline">Every platform, one feed of truth.</h1>
        <p className="auth-sub">
          Track followers, engagement, and reach across Twitter and Instagram —
          then schedule what goes out next, all from a single dashboard.
        </p>
        <div className="auth-stat-row">
          <div className="auth-stat">
            <div className="num">2</div>
            <div className="label">Platforms connected</div>
          </div>
          <div className="auth-stat">
            <div className="num">24/7</div>
            <div className="label">Scheduler uptime</div>
          </div>
          <div className="auth-stat">
            <div className="num">Live</div>
            <div className="label">Metric refresh</div>
          </div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="sub-text">Sign in to your dashboard.</p>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
