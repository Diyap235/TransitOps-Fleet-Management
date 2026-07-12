import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, UserRound, Route, Wrench, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers } from '../api/drivers.api';
import { getTrips } from '../api/trips.api';
import { getMaintenanceRecords } from '../api/maintenance.api';

const COLOR_MAP = {
  blue:   { icon: '#2563EB', bg: '#EFF6FF' },
  green:  { icon: '#16A34A', bg: '#F0FDF4' },
  orange: { icon: '#D97706', bg: '#FFFBEB' },
  red:    { icon: '#DC2626', bg: '#FEF2F2' },
  purple: { icon: '#7C3AED', bg: '#F5F3FF' },
};

const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    Icon: Truck,     color: 'blue'   },
  { to: '/drivers',     label: 'Drivers',     Icon: UserRound, color: 'purple' },
  { to: '/trips',       label: 'Trips',       Icon: Route,     color: 'green'  },
  { to: '/maintenance', label: 'Maintenance', Icon: Wrench,    color: 'orange' },
  { to: '/reports',     label: 'Reports',     Icon: BarChart3, color: 'red'    },
];

const TRIP_STATUS_COLOR = {
  Draft:      { bg: '#F1F5F9', color: '#475569' },
  Dispatched: { bg: '#DBEAFE', color: '#1D4ED8' },
  Completed:  { bg: '#DCFCE7', color: '#15803D' },
  Cancelled:  { bg: '#FEE2E2', color: '#B91C1C' },
};

const MAINT_STATUS_COLOR = {
  Active: { bg: '#FEF3C7', color: '#B45309' },
  Closed: { bg: '#DCFCE7', color: '#15803D' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]       = useState({ vehicles: '—', trips: '—', drivers: '—', maintenance: '—' });
  const [recentTrips, setRecentTrips]         = useState([]);
  const [recentMaint, setRecentMaint]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getVehicles(),
      getDrivers(),
      getTrips(),
      getMaintenanceRecords(),
    ]).then(([v, d, t, m]) => {
      const vehicles     = v.data;
      const drivers      = d.data;
      const trips        = t.data;
      const maintenance  = m.data;

      setStats({
        vehicles:    vehicles.length,
        trips:       trips.filter(t => t.status === 'Dispatched').length,
        drivers:     drivers.filter(d => d.status === 'Available').length,
        maintenance: maintenance.filter(m => m.status === 'Active').length,
      });

      // 5 most recent of each
      setRecentTrips(trips.slice(0, 5));
      setRecentMaint(maintenance.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STAT_CARDS = [
    { label: 'Total Vehicles',     value: stats.vehicles,    Icon: Truck,     color: 'blue'   },
    { label: 'Active Trips',       value: stats.trips,       Icon: Route,     color: 'green'  },
    { label: 'Drivers Available',  value: stats.drivers,     Icon: UserRound, color: 'purple' },
    { label: 'Open Maintenance',   value: stats.maintenance, Icon: Wrench,    color: 'orange' },
  ];

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
              <div className="stat-card-value">
                {loading ? <span style={{ fontSize: 20, color: '#9CA3AF' }}>…</span> : value}
              </div>
              <div className="stat-card-label">{label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Quick actions ── */}
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

      {/* ── Recent activity: two columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Trips */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Trips</span>
            <Link to="/trips" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Loading…</div>
          ) : recentTrips.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-state-icon"><Route size={20} strokeWidth={1.5} /></div>
              <h3>No trips yet</h3>
              <p>Create your first trip to see activity here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map(t => {
                    const sc = TRIP_STATUS_COLOR[t.status] ?? { bg: '#F1F5F9', color: '#475569' };
                    return (
                      <tr key={t._id}>
                        <td className="td-primary" style={{ fontSize: 12 }}>
                          {t.source} → {t.destination}
                        </td>
                        <td style={{ fontSize: 12, color: '#6B7280' }}>{t.driver?.name ?? '—'}</td>
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
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Maintenance</span>
            <Link to="/maintenance" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Loading…</div>
          ) : recentMaint.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-state-icon"><Wrench size={20} strokeWidth={1.5} /></div>
              <h3>No maintenance records</h3>
              <p>Log your first maintenance event to see it here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMaint.map(r => {
                    const sc = MAINT_STATUS_COLOR[r.status] ?? { bg: '#F1F5F9', color: '#475569' };
                    return (
                      <tr key={r._id}>
                        <td className="td-primary" style={{ fontSize: 12 }}>
                          {r.vehicle?.registrationNumber ?? '—'}
                        </td>
                        <td style={{ fontSize: 12, color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.description}
                        </td>
                        <td>
                          <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Dashboard;
