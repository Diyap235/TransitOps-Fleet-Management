import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3,
  TrendingUp, TrendingDown, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Stat card config — accent colours map to DC tokens ──────────
const STATS = [
  {
    label:     'Total Vehicles',
    value:     '—',
    icon:      Truck,
    color:     'blue',
    trend:     null,
    accentVar: '--dc-blue',
    bgVar:     '--dc-blue-bg',
  },
  {
    label:     'Active Trips',
    value:     '—',
    icon:      Route,
    color:     'teal',
    trend:     null,
    accentVar: '--dc-teal',
    bgVar:     '--dc-teal-bg',
  },
  {
    label:     'Drivers Available',
    value:     '—',
    icon:      UserRound,
    color:     'violet',
    trend:     null,
    accentVar: '--dc-violet',
    bgVar:     '--dc-violet-bg',
  },
  {
    label:     'Open Maintenance',
    value:     '—',
    icon:      Wrench,
    color:     'red',
    trend:     null,
    accentVar: '--dc-red',
    bgVar:     '--dc-red-bg',
  },
];

// ── Quick-action config — accent + mono subtitle ─────────────────
const QUICK = [
  {
    to:       '/vehicles',
    label:    'Vehicles',
    sub:      'FLEET REGISTRY',
    Icon:     Truck,
    accent:   '--dc-blue',
    accentBg: '--dc-blue-bg',
  },
  {
    to:       '/drivers',
    label:    'Drivers',
    sub:      'CREW ROSTER',
    Icon:     UserRound,
    accent:   '--dc-violet',
    accentBg: '--dc-violet-bg',
  },
  {
    to:       '/trips',
    label:    'Trips',
    sub:      'ROUTE LOG',
    Icon:     Route,
    accent:   '--dc-teal',
    accentBg: '--dc-teal-bg',
  },
  {
    to:       '/maintenance',
    label:    'Maintenance',
    sub:      'SERVICE DESK',
    Icon:     Wrench,
    accent:   '--dc-red',
    accentBg: '--dc-red-bg',
  },
  {
    to:       '/reports',
    label:    'Reports',
    sub:      'ANALYTICS',
    Icon:     BarChart3,
    accent:   '--dc-reports',
    accentBg: '--dc-reports-bg',
  },
];

// ─────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();

  // ── greeting logic unchanged ──────────────────────────────────
  const now  = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>{greeting}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
          <p>Here is what is happening with your fleet today.</p>
        </div>
      </div>

      {/* ── Stat cards + animated connector rail ── */}
      <div className="dc-connector-wrap" style={{ marginBottom: 24 }}>

        {/* SVG dashed rail — sits behind cards via z-index */}
        <svg
          className="dc-connector-svg"
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            className="dc-connector-line"
            x1="0" y1="12" x2="1000" y2="12"
          />
        </svg>

        {/* Cards */}
        <div className="stats-grid">
          {STATS.map(({ label, value, icon: Icon, accentVar, bgVar }) => (
            <div
              key={label}
              className="dc-stat-card"
              style={{ '--dc-accent': `var(${accentVar})`, '--dc-accent-bg': `var(${bgVar})` }}
            >
              {/* Glowing status dot */}
              <div className="dc-stat-dot" />

              {/* Tinted icon chip */}
              <div className="dc-icon-chip">
                <Icon size={18} strokeWidth={2} />
              </div>

              {/* Value */}
              <div className="dc-stat-value">{value === '—' ? '— —' : value}</div>

              {/* Label */}
              <div className="dc-stat-label">{label}</div>

              {/* Awaiting-sync caption */}
              <div className="dc-stat-caption">Awaiting Sync</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div className="card-body">
          <div className="quick-action-grid">
            {QUICK.map(({ to, label, sub, Icon, accent, accentBg }) => (
              <Link
                key={to}
                to={to}
                className="dc-quick-card"
                style={{
                  '--dc-card-accent':    `var(${accent})`,
                  '--dc-card-accent-bg': `var(${accentBg})`,
                }}
              >
                <div className="dc-quick-icon">
                  <Icon size={17} strokeWidth={2} />
                </div>
                <span className="dc-quick-label">{label}</span>
                <span className="dc-quick-sub">{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity — radar-sweep empty state ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
        </div>
        <div className="dc-radar-wrap">
          {/* Rotating radar ring with centered icon */}
          <div className="dc-radar-ring">
            <Activity size={20} strokeWidth={1.5} />
          </div>
          <h3>No activity yet</h3>
          <p>
            Recent trips, maintenance events, and alerts will appear here
            the moment your fleet starts reporting in.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
