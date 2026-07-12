import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, UserRound, Route,
  Wrench, BarChart3, LogOut, Bell, Truck as TruckIcon,
  Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { to: '/',            label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/vehicles',    label: 'Vehicles',    Icon: Truck           },
  { to: '/drivers',     label: 'Drivers',     Icon: UserRound       },
  { to: '/trips',       label: 'Trips',       Icon: Route           },
  { to: '/maintenance', label: 'Maintenance', Icon: Wrench          },
  { to: '/reports',     label: 'Reports',     Icon: BarChart3       },
];

const PAGE_TITLES = {
  '/':            'Dashboard',
  '/vehicles':    'Vehicles',
  '/drivers':     'Drivers',
  '/trips':       'Trips',
  '/maintenance': 'Maintenance',
  '/reports':     'Reports',
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Live clock — ticks every second, cleaned up on unmount
  const fmt = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
  const [clock, setClock] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setClock(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'TransitOps';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <TruckIcon size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="sidebar-brand-text">
            Transit<span>Ops</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' active' : '')
              }
            >
              <span className="sidebar-link-icon">
                <Icon size={16} strokeWidth={2} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name ?? 'User'}</div>
              <div className="sidebar-user-role">{user?.role ?? 'Member'}</div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{pageTitle}</span>
          </div>
          <div className="topbar-right">
            <div className="clock-pill">
              <span className="clock-dot" />
              {clock}
            </div>
            <button
              className="topbar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark'
                ? <Sun  size={17} strokeWidth={2} />
                : <Moon size={17} strokeWidth={2} />}
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={17} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="page-body">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
