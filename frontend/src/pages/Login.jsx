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

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const submit = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
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
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    submit(form);
  };

  const handleDemo = () => {
    setForm(DEMO);
    submit(DEMO);
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
              type="email" name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'} name="password"
                className="form-control"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
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

        <button className="btn-demo" onClick={handleDemo} disabled={loading}>
          ⚡ Try Demo Account
        </button>

        <div className="demo-hint">
          <span>alex@demo.com</span> · <span>demo1234</span>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
