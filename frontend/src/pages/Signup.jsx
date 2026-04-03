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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'At least 2 characters';
        if (value.trim().length > 50) return 'Max 50 characters';
        return '';
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (!/^[a-z0-9_]{3,20}$/.test(value.toLowerCase().trim()))
          return '3–20 chars, only letters, numbers, underscore (no spaces)';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'At least 6 characters';
        return '';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear field error on change
    const err = validate(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validate(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errors = {};
    Object.keys(form).forEach(key => {
      const err = validate(key, form[key]);
      if (err) errors[key] = err;
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        ...form,
        username: form.username.toLowerCase().trim(),
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

  const Field = ({ label, name, type = 'text', placeholder, hint }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className={type === 'password' ? 'password-wrapper' : ''}>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          className={`form-control ${fieldErrors[name] ? 'input-error' : form[name] && !fieldErrors[name] ? 'input-success' : ''}`}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={name}
        />
        {type === 'password' && (
          <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {fieldErrors[name]
        ? <p className="field-error">⚠ {fieldErrors[name]}</p>
        : hint && <p className="field-hint">{hint}</p>
      }
    </div>
  );

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-orb-extra" />
      <div className="auth-card">
        <div className="auth-brand">🌐 TaskPlanet</div>
        <p className="auth-tagline">Share your world. Connect your story.</p>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Full Name"
            name="name"
            placeholder="Your full name"
            hint="2–50 characters"
          />
          <Field
            label="Username"
            name="username"
            placeholder="e.g. john_doe"
            hint="3–20 chars · letters, numbers, underscore only · no spaces"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            hint="Enter a valid email address"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            hint="At least 6 characters"
          />

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
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
