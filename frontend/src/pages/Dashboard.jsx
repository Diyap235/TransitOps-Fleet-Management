import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { label: 'Total Vehicles',      value: '—', icon: Truck,     color: 'blue',   trend: null },
  { label: 'Active Trips',        value: '—', icon: Route,     color: 'green',  trend: null },
  { label: 'Drivers Available',   value: '—', icon: UserRound, color: 'purple', trend: null },
  { label: 'Open Maintenance',    value: '—', icon: Wrench,    color: 'orange', trend: null },
];

const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    Icon: Truck,     color: 'blue'   },
  { to: '/drivers',     label: 'Drivers',     Icon: UserRound, color: 'purple' },
  { to: '/trips',       label: 'Trips',       Icon: Route,     color: 'green'  },
  { to: '/maintenance', label: 'Maintenance', Icon: Wrench,    color: 'orange' },
  { to: '/reports',     label: 'Reports',     Icon: BarChart3, color: 'red'    },
];

const COLOR_MAP = {
  blue:   { icon: '#2563EB', bg: '#EFF6FF' },
  green:  { icon: '#16A34A', bg: '#F0FDF4' },
  orange: { icon: '#D97706', bg: '#FFFBEB' },
  red:    { icon: '#DC2626', bg: '#FEF2F2' },
  purple: { icon: '#7C3AED', bg: '#F5F3FF' },
};

const Dashboard = () => {
  const { user } = useAuth();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>{greeting}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
          <p>Here is what is happening with your fleet today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map(({ label, value, icon: Icon, color }) => {
          const c = COLOR_MAP[color];
          return (
            <div className="stat-card" key={label}>
              <div className="stat-card-header">
                <div className="stat-card-icon" style={{ background: c.bg, color: c.icon }}>
                  <Icon size={18} strokeWidth={2} />
                </div>
              </div>
              <div className="stat-card-value">{value}</div>
              <div className="stat-card-label">{label}</div>
              <div className="stat-card-trend trend-neutral" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Connect data to populate</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div className="card-body">
          <div className="quick-action-grid">
            {QUICK.map(({ to, label, Icon, color }) => {
              const c = COLOR_MAP[color];
              return (
                <Link key={to} to={to} className="quick-action-card">
                  <div
                    className="quick-action-icon"
                    style={{ background: c.bg, color: c.icon }}
                  >
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <span className="quick-action-label">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">
            <BarChart3 size={22} strokeWidth={1.5} />
          </div>
          <h3>No activity yet</h3>
          <p>Recent trips, maintenance events, and alerts will appear here once data is available.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
