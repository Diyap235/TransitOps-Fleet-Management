import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/auth.api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();


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


            A unified operations platform for real-time vehicle tracking,
            driver management, trip dispatch, and financial reporting.
          </p>


            {[
              'Real-time vehicle tracking',
              'Driver safety scoring',
              'Automated maintenance alerts',
              'Financial analytics & reporting',
            ].map((f) => (

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  // Left dark panel
  left: {
    flex: 1,
    background: 'linear-gradient(150deg, #0c1829 0%, #0f2847 50%, #0c1829 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 48px',
    color: '#fff',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 'auto',
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  brandBold: { color: '#fff' },
  brandAccent: { color: '#3b82f6' },

  hero: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 480,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.25,
    marginBottom: 16,
    color: '#fff',
  },
  heroAccent: {
    color: '#3b82f6',
  },
  heroSub: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.7,
    marginBottom: 32,
    maxWidth: 380,
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#cbd5e1',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#3b82f6',
    flexShrink: 0,
  },

  // Right white panel
  right: {
    width: 480,
    flexShrink: 0,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
  },
  formBox: {
    width: '100%',
    maxWidth: 360,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 24,
  },

  // Tabs
  tabs: {
    display: 'flex',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: '9px 0',
    border: 'none',
    background: 'transparent',
    fontSize: 13,
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  tabActive: {
    background: '#fff',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },

  errorBox: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: 7,
    fontSize: 13,
    marginBottom: 16,
  },

  // Form fields
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.15s',
    background: '#fff',
  },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 2,
  },

  submitBtn: {
    width: '100%',
    padding: '11px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'background 0.15s',
  },

  switchText: {
    marginTop: 16,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 12,
    padding: 0,
  },
};

export default Login;
