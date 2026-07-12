import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Vehicles',     value: '—', cls: 'blue'   },
    { label: 'Active Trips',       value: '—', cls: 'green'  },
    { label: 'Pending Maintenance',value: '—', cls: 'orange' },
    { label: 'Monthly Expenses',   value: '—', cls: 'red'    },
  ];

  const quickLinks = [
    { to: '/vehicles',    label: 'Manage Vehicles',    icon: '🚛' },
    { to: '/drivers',     label: 'Manage Drivers',     icon: '👤' },
    { to: '/trips',       label: 'Dispatch a Trip',    icon: '🗺️'  },
    { to: '/maintenance', label: 'Log Maintenance',    icon: '🔧' },
    { to: '/reports',     label: 'View Reports',       icon: '📈' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>
            Welcome back, <strong>{user?.name ?? 'User'}</strong> · {user?.role}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="label">{s.label}</div>
            <div className={`value ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="card">
        <div className="card-title">Quick Actions</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {quickLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="btn btn-outline"
              style={{ textDecoration: 'none' }}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="card">
        <div className="card-title">Recent Activity</div>
        <div className="alert alert-info">
          Stats and recent activity will load here once data is available.
        </div>
      </div>
    </>
  );
};

export default Dashboard;
