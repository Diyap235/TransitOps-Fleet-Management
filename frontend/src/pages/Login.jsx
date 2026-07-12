import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/auth.api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
  });

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register' && form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (tab === 'register' && form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = tab === 'login'
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: form.name, email: form.email, password: form.password });

      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-brand">
            <div className="auth-brand-icon">
              <Truck size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="auth-brand-name">
              Transit<span>Ops</span>
            </span>
          </div>

          <h1 className="auth-headline">
            Manage your fleet<br />
            <span>smarter, faster.</span>
          </h1>
          <p className="auth-subline">
            A unified operations platform for real-time vehicle tracking,
            driver management, trip dispatch, and financial reporting.
          </p>

          <div className="auth-features">
            {[
              'Real-time vehicle tracking',
              'Driver safety scoring',
              'Automated maintenance alerts',
              'Financial analytics & reporting',
            ].map((f) => (
              <div className="auth-feature" key={f}>
                <div className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-box-title">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="auth-box-subtitle">
            {tab === 'login'
              ? 'Sign in to your TransitOps workspace'
              : 'Get started with TransitOps today'}
          </p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === 'login' ? ' active' : ''}`}
              onClick={() => switchTab('login')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab${tab === 'register' ? ' active' : ''}`}
              onClick={() => switchTab('register')}
              type="button"
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} autoComplete="off" noValidate>

            {/* Full name — register only */}
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label form-label-required">Full Name</label>
                <div className="input-group">
                  <span className="input-icon"><User size={15} /></span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label form-label-required">Email Address</label>
              <div className="input-group">
                <span className="input-icon"><Mail size={15} /></span>
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label form-label-required">Password</label>
              <div className="input-group">
                <span className="input-icon"><Lock size={15} /></span>
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  required
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password — register only */}
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label form-label-required">Confirm Password</label>
                <div className="input-group">
                  <span className="input-icon"><Lock size={15} /></span>
                  <input
                    className="form-control"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={form.confirm}
                    onChange={set('confirm')}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowConfirm((p) => !p)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 6, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading && <span className="spinner" />}
              {loading
                ? (tab === 'login' ? 'Signing in…' : 'Creating account…')
                : (tab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            {tab === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
            >
              {tab === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
