import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, UserRound, Route,
  Wrench, BarChart3, LogOut, Bell, Truck as TruckIcon,
  Moon, Sun, Search, Droplet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ToastProvider, ToastContainer } from '../context/ToastContext';
import CommandPalette from './CommandPalette';

const NAV = [
  { to: '/',              label: 'Dashboard',       Icon: LayoutDashboard, route: '/' },
  { to: '/vehicles',      label: 'Vehicles',        Icon: Truck,           route: '/vehicles' },
  { to: '/drivers',       label: 'Drivers',         Icon: UserRound,       route: '/drivers' },
  { to: '/trips',         label: 'Trips',           Icon: Route,           route: '/trips' },
  { to: '/maintenance',   label: 'Maintenance',     Icon: Wrench,          route: '/maintenance' },
  { to: '/fuel-expenses', label: 'Fuel & Expenses', Icon: Droplet,         route: '/fuel-expenses' },
  { to: '/reports',       label: 'Reports',         Icon: BarChart3,       route: '/reports' },
];

const PAGE_TITLES = {
  '/':              'Dashboard',
  '/vehicles':      'Vehicles',
  '/drivers':       'Drivers',
  '/trips':         'Trips',
  '/maintenance':   'Maintenance',
  '/fuel-expenses': 'Fuel & Expenses',
  '/reports':       'Reports',
};

const LayoutInner = ({ children }) => {
  const { user, logout, canAccessRoute } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Filter nav items based on RBAC permissions
  const visibleNav = NAV.filter(item => canAccessRoute(item.route));

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

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Member';
    const roleMap = {
      FleetManager: 'Fleet Manager',
      Driver: 'Driver',
      SafetyOfficer: 'Safety Officer',
      FinancialAnalyst: 'Financial Analyst',
    };
    return roleMap[role] || role;
  };

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
          {visibleNav.map(({ to, label, Icon }) => (
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
              <div className="sidebar-user-role">{formatRole(user?.role)}</div>
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
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0F172A', border: '1px solid #1E293B',
              borderRadius: 99, padding: '5px 14px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {/* Green pulsing dot */}
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#10B981', flexShrink: 0,
                boxShadow: '0 0 0 0 rgba(16,185,129,0.6)',
                animation: 'pulse-green 2s infinite',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', letterSpacing: '1px' }}>
                {clock}
              </span>
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
