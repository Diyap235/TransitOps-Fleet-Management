import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/auth.api';

const FEATURES = [
  'Real-time vehicle tracking',
  'Driver safety scoring',
  'Automated maintenance alerts',
  'Financial analytics & reporting',
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register') {
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{ flex: 1, background: 'linear-gradient(150deg,#0c1829 0%,#0f2847 50%,#0c1829 100%)', display: 'flex', flexDirection: 'column', padding: '40px 48px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Transit<span style={{ color: '#3b82f6' }}>Ops</span></span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 480 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
            Manage your fleet<br /><span style={{ color: '#3b82f6' }}>smarter, faster.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
            A unified operations platform for real-time vehicle tracking, driver management, trip dispatch, and financial reporting.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#cbd5e1' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, display: 'inline-block' }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ width: 480, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            {tab === 'login' ? 'Sign in to your TransitOps workspace' : 'Get started with TransitOps today'}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
            {['login', 'register'].map((t) => (
              <button key={t} type="button" onClick={() => switchTab(t)}
                style={{ flex: 1, padding: '9px 0', border: 'none', background: tab === t ? '#eff6ff' : 'transparent', fontSize: 13, fontWeight: 600, color: tab === t ? '#2563eb' : '#64748b', cursor: 'pointer' }}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 7, fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>

            {/* Full name — register only */}
            {tab === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                  <input type="text" placeholder="Enter your full name" value={form.name} onChange={set('name')} required autoComplete="off"
                    style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }} />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                <input type="email" placeholder="Enter your email" value={form.email} onChange={set('email')} required autoComplete="off"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={set('password')} required autoComplete="new-password"
                  style={{ width: '100%', padding: '10px 38px 10px 38px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }} />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#9ca3af' }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm password — register only */}
            {tab === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password"
                    style={{ width: '100%', padding: '10px 38px 10px 38px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#9ca3af' }}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 11, background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
              {loading ? (tab === 'login' ? 'Signing in…' : 'Creating account…') : (tab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
              {tab === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
