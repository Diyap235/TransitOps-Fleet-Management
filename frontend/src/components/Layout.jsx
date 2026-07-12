import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, UserRound, Route,
  Wrench, BarChart3, LogOut, Bell, Truck as TruckIcon,
  Moon, Sun, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ToastProvider, ToastContainer } from '../context/ToastContext';
import CommandPalette from './CommandPalette';

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

const LayoutInner = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Live clock
  const fmt = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
  const [clock, setClock] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setClock(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  // ⌘K / Ctrl+K global shortcut
  const openPalette  = useCallback(() => setPaletteOpen(true),  []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'TransitOps';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-layout">
      {/* ── Command Palette ── */}
      <CommandPalette open={paletteOpen} onClose={closePalette} />

      {/* ── Toast stack ── */}
      <ToastContainer />

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <TruckIcon size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="sidebar-brand-text">Transit<span>Ops</span></span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <span className="sidebar-link-icon"><Icon size={16} strokeWidth={2} /></span>
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
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Sign out">
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left" style={{ gap: 12 }}>
            <span className="topbar-title">{pageTitle}</span>
            {/* ⌘K search trigger */}
            <button className="cmd-trigger-btn" onClick={openPalette} title="Search or jump to… (⌘K)">
              <Search size={13} strokeWidth={2} />
              Search or jump to…
              <kbd>⌘K</kbd>
            </button>
          </div>
          <div className="topbar-right">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px', marginRight: 4 }}>
              {clock}
            </div>
            <button
              className="topbar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
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

// Wrap LayoutInner in ToastProvider so every page can call useToast()
const Layout = ({ children }) => (
  <ToastProvider>
    <LayoutInner>{children}</LayoutInner>
  </ToastProvider>
);

export default Layout;
