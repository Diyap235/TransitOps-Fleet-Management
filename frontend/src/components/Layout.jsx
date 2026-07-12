import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/',            label: 'Dashboard',   icon: '📊' },
  { to: '/vehicles',    label: 'Vehicles',    icon: '🚛' },
  { to: '/drivers',     label: 'Drivers',     icon: '👤' },
  { to: '/trips',       label: 'Trips',       icon: '🗺️'  },
  { to: '/maintenance', label: 'Maintenance', icon: '🔧' },
  { to: '/reports',     label: 'Reports',     icon: '📈' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          Transit<span>Ops</span>
        </div>
        <nav>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <strong>{user?.name ?? 'User'}</strong>
          {user?.role}
          <button
            onClick={handleLogout}
            style={{ marginTop: 10, width: '100%', padding: '7px', background: '#1e293b', color: '#94a3b8', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
