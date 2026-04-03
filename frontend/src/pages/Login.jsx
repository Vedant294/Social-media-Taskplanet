import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import AuthBackground from '../components/AuthBackground.jsx';

const DEMO = { email: 'alex@demo.com', password: 'demo1234' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });
      login(data);
      toast.success('Welcome back! 👋');
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    doLogin(form);
  };

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-orb-extra" />
      <div className="auth-card">
        <div className="auth-brand">🌐 TaskPlanet</div>
        <p className="auth-tagline">Share your world. Connect your story.</p>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g. you@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            Sign In
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button
          type="button"
          className="btn-demo"
          disabled={loading}
          onClick={() => doLogin(DEMO)}
        >
          ⚡ Try Demo Account
        </button>
        <p className="demo-hint">email: alex@demo.com &nbsp;·&nbsp; password: demo1234</p>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
