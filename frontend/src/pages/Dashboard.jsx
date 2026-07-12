import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, UserRound, Route, Wrench, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  dashboardStats, trips, maintenanceRecords,
} from '../data/dummyData';

const COLOR_MAP = {
  blue:   { icon: '#2563EB', bg: '#EFF6FF' },
  green:  { icon: '#16A34A', bg: '#F0FDF4' },
  orange: { icon: '#D97706', bg: '#FFFBEB' },
  red:    { icon: '#DC2626', bg: '#FEF2F2' },
  purple: { icon: '#7C3AED', bg: '#F5F3FF' },
};

const TRIP_STATUS_COLOR = {
  Dispatched: { bg: '#DBEAFE', color: '#1D4ED8' },
  Completed:  { bg: '#DCFCE7', color: '#15803D' },
  Cancelled:  { bg: '#FEE2E2', color: '#B91C1C' },
  Draft:      { bg: '#F1F5F9', color: '#475569' },
};

const MAINT_PRIORITY_COLOR = {
  High:   { bg: '#FEE2E2', color: '#B91C1C' },
  Medium: { bg: '#FEF3C7', color: '#B45309' },
  Low:    { bg: '#DCFCE7', color: '#15803D' },
};

const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    Icon: Truck,     color: 'blue'   },
  { to: '/drivers',     label: 'Drivers',     Icon: UserRound, color: 'purple' },
  { to: '/trips',       label: 'Trips',       Icon: Route,     color: 'green'  },
  { to: '/maintenance', label: 'Maintenance', Icon: Wrench,    color: 'orange' },
  { to: '/reports',     label: 'Reports',     Icon: BarChart3, color: 'red'    },
];

const Dashboard = () => {
  const { user } = useAuth();
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STAT_CARDS = [
    { label: 'Total Vehicles',    value: dashboardStats.totalVehicles,    Icon: Truck,     color: 'blue'   },
    { label: 'Active Trips',      value: dashboardStats.activeTrips,      Icon: Route,     color: 'green'  },
    { label: 'Drivers Available', value: dashboardStats.driversAvailable, Icon: UserRound, color: 'purple' },
    { label: 'Open Maintenance',  value: dashboardStats.openMaintenance,  Icon: Wrench,    color: 'orange' },
  ];

  const recentTrips = trips.slice(0, 5);
  const recentMaint = maintenanceRecords.slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>{greeting}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
          <p>Here is what is happening with your fleet today.</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        {STAT_CARDS.map(({ label, value, Icon, color }) => {
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
            </div>
          );
        })}
      </div>

      {/* ── Quick actions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><span className="card-title">Quick Actions</span></div>
        <div className="card-body">
          <div className="quick-action-grid">
            {QUICK.map(({ to, label, Icon, color }) => {
              const c = COLOR_MAP[color];
              return (
                <Link key={to} to={to} className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: c.bg, color: c.icon }}>
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <span className="quick-action-label">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Trips */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Trips</span>
            <Link to="/trips" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Route</th><th>Driver</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentTrips.map(t => {
                  const sc = TRIP_STATUS_COLOR[t.status] ?? { bg: '#F1F5F9', color: '#475569' };
                  return (
                    <tr key={t.tripId}>
                      <td className="td-primary" style={{ fontSize: 12 }}>{t.source} → {t.destination}</td>
                      <td style={{ fontSize: 12, color: '#6B7280' }}>{t.driver}</td>
                      <td>
                        <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Maintenance Alerts</span>
            <Link to="/maintenance" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Vehicle</th><th>Issue</th><th>Priority</th></tr>
              </thead>
              <tbody>
                {recentMaint.map(r => {
                  const pc = MAINT_PRIORITY_COLOR[r.priority] ?? { bg: '#F1F5F9', color: '#475569' };
                  return (
                    <tr key={r.id}>
                      <td className="td-primary" style={{ fontSize: 12 }}>{r.vehicle}</td>
                      <td style={{ fontSize: 12, color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.issue}</td>
                      <td>
                        <span style={{ background: pc.bg, color: pc.color, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                          {r.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
