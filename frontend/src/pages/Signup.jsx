import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import AuthBackground from '../components/AuthBackground.jsx';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, email, password } = form;

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill in all fields'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name:     name.trim(),
        username: username.toLowerCase().trim(),
        email:    email.trim().toLowerCase(),
        password,
      });
      login(data);
      toast.success('Welcome to TaskPlanet! 🎉');
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <label>Full Name</label>
            <input
              type="text" name="name"
              className="form-control"
              placeholder="Your full name (2–50 chars)"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text" name="username"
              className="form-control"
              placeholder="e.g. john_doe or johndoe"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
