import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, UserRound, Route, Wrench, BarChart3, Activity, CheckCircle, TrendingUp, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardStats, trips, maintenanceRecords, vehicles } from '../data/dummyData';

const TRIP_STATUS_COLOR = {
  Dispatched: { bg: 'rgba(76,141,255,0.15)',  color: '#60A5FA' },
  Completed:  { bg: 'rgba(47,212,168,0.15)',  color: '#2FD4A8' },
  Cancelled:  { bg: 'rgba(251,91,75,0.15)',   color: '#FB5B4B' },
  Draft:      { bg: 'rgba(107,90,224,0.12)',  color: '#9C8CFF' },
};

const MAINT_PRIORITY_COLOR = {
  High:   { bg: 'rgba(251,91,75,0.15)',   color: '#FB5B4B' },
  Medium: { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623' },
  Low:    { bg: 'rgba(47,212,168,0.15)',  color: '#2FD4A8' },
};

const QUICK_ACTIONS = [
  { to: '/vehicles',    label: 'Vehicles',    sub: 'FLEET REGISTRY', Icon: Truck,     accent: 'var(--dc-blue)',   accentBg: 'var(--dc-blue-bg)'   },
  { to: '/drivers',     label: 'Drivers',     sub: 'CREW ROSTER',    Icon: UserRound, accent: 'var(--dc-violet)', accentBg: 'var(--dc-violet-bg)' },
  { to: '/trips',       label: 'Trips',       sub: 'ROUTE LOG',      Icon: Route,     accent: 'var(--dc-teal)',   accentBg: 'var(--dc-teal-bg)'   },
  { to: '/maintenance', label: 'Maintenance', sub: 'SERVICE DESK',   Icon: Wrench,    accent: 'var(--dc-red)',    accentBg: 'var(--dc-red-bg)'    },
  { to: '/reports',     label: 'Reports',     sub: 'ANALYTICS',      Icon: BarChart3, accent: 'var(--dc-reports)',accentBg: 'var(--dc-reports-bg)'},
];

const recentTrips = trips.slice(0, 5);
const recentMaint = maintenanceRecords.slice(0, 5);

const Dashboard = () => {
  const { user } = useAuth();
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Filter states
  const [vehicleType, setVehicleType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');

  // Compute KPIs from actual data
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const vehiclesInMaintenance = vehicles.filter(v => v.status === 'In Shop' || v.status === 'Maintenance').length;

  // Extended STAT_CARDS with missing KPIs
  const COMPUTED_STAT_CARDS = [
    { label: 'Total Vehicles',        caption: 'FLEET REGISTRY',     value: dashboardStats.totalVehicles,    Icon: Truck,       accent: 'var(--dc-blue)',   accentBg: 'var(--dc-blue-bg)'   },
    { label: 'Available Vehicles',    caption: 'READY FOR DISPATCH', value: availableVehicles,               Icon: CheckCircle, accent: 'var(--dc-green)',  accentBg: 'var(--dc-green-bg)'  },
    { label: 'Vehicles in Maintenance', caption: 'SERVICE QUEUE',   value: vehiclesInMaintenance,           Icon: Wrench,      accent: 'var(--dc-orange)', accentBg: 'var(--dc-orange-bg)' },
    { label: 'Active Trips',          caption: 'ROUTE LOG',          value: dashboardStats.activeTrips,      Icon: Route,       accent: 'var(--dc-teal)',   accentBg: 'var(--dc-teal-bg)'   },
    { label: 'Drivers Available',     caption: 'CREW ROSTER',        value: dashboardStats.driversAvailable, Icon: UserRound,  accent: 'var(--dc-violet)', accentBg: 'var(--dc-violet-bg)' },
    { label: 'Open Maintenance',      caption: 'SERVICE DESK',       value: dashboardStats.openMaintenance,  Icon: TrendingUp,  accent: 'var(--dc-red)',    accentBg: 'var(--dc-red-bg)'    },
  ];

  // Get unique vehicle types and regions from data
  const vehicleTypes = ['All', ...new Set(vehicles.map(v => v.model?.split(' ')[0] || 'Other'))];
  const regions = ['All', ...new Set(vehicles.map(v => v.location?.split(',')[1]?.trim() || 'Other'))];
  const statuses = ['All', 'Dispatched', 'Completed', 'Cancelled'];

  // Filter trips and maintenance records
  const filteredTrips = trips.filter(t => {
    let matches = true;
    if (status !== 'All' && t.status !== status) matches = false;
    return matches;
  }).slice(0, 5);

  const filteredMaint = maintenanceRecords.slice(0, 5);

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="font-grotesk">{greeting}, {user?.name?.split(' ')[0] ?? 'there'}</h1>
          <p>Here is what is happening with your fleet today.</p>
        </div>
        <span className="live-badge"><span className="live-badge-dot" />LIVE</span>
      </div>

      {/* ── Filter Controls ── */}
      <div className="card" style={{ marginBottom: 20, background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(30, 41, 59, 0.8)' }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', padding: '12px 16px' }}>
          <Filter size={16} strokeWidth={2} style={{ color: 'var(--dc-text-faint)' }} />
          <label style={{ fontSize: 12, color: 'var(--dc-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filters:</label>
          
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)}
            style={{ padding: '6px 10px', fontSize: 12, background: 'var(--dc-bg)', border: '1px solid var(--dc-line)', borderRadius: 6, color: 'var(--dc-text)', cursor: 'pointer' }}>
            {vehicleTypes.map(t => <option key={t}>{t}</option>)}
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ padding: '6px 10px', fontSize: 12, background: 'var(--dc-bg)', border: '1px solid var(--dc-line)', borderRadius: 6, color: 'var(--dc-text)', cursor: 'pointer' }}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>

          <select value={region} onChange={e => setRegion(e.target.value)}
            style={{ padding: '6px 10px', fontSize: 12, background: 'var(--dc-bg)', border: '1px solid var(--dc-line)', borderRadius: 6, color: 'var(--dc-text)', cursor: 'pointer' }}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>

          {(vehicleType !== 'All' || status !== 'All' || region !== 'All') && (
            <button onClick={() => { setVehicleType('All'); setStatus('All'); setRegion('All'); }}
              style={{ marginLeft: 'auto', padding: '6px 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--dc-red)', borderRadius: 6, color: 'var(--dc-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <X size={13} />Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── DC Stat cards with animated connector rail ── */}
      <div className="dc-connector-wrap" style={{ marginBottom: 24 }}>
        <svg className="dc-connector-svg" viewBox="0 0 100 1" preserveAspectRatio="none">
          <line className="dc-connector-line" x1="0" y1="0.5" x2="100" y2="0.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="stats-grid">
          {COMPUTED_STAT_CARDS.map(({ label, caption, value, Icon, accent, accentBg }) => (
            <div
              className="dc-stat-card"
              key={label}
              style={{ '--dc-accent': accent, '--dc-accent-bg': accentBg }}
            >
              <span className="dc-stat-dot" style={{ background: accent, boxShadow: `0 0 0 3px ${accentBg}` }} />
              <div className="dc-icon-chip" style={{ background: accentBg, color: accent }}>
                <Icon size={17} strokeWidth={2} />
              </div>
              <div className="dc-stat-value font-mono">{value}</div>
              <div className="dc-stat-label">{label}</div>
              <div className="dc-stat-caption">{caption}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title font-grotesk">Quick Actions</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {QUICK_ACTIONS.map(({ to, label, sub, Icon, accent, accentBg }) => (
              <Link
                key={to}
                to={to}
                className="dc-quick-card"
                style={{ '--dc-card-accent': accent, '--dc-card-accent-bg': accentBg, textDecoration: 'none' }}
              >
                <div className="dc-quick-icon" style={{ background: accentBg, color: accent }}>
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className="dc-quick-label">{label}</span>
                <span className="dc-quick-sub">{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Trips */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title font-grotesk">Recent Trips</span>
            <Link to="/trips" style={{ fontSize: 12, color: 'var(--dc-blue)', textDecoration: 'none', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
              VIEW ALL →
            </Link>
          </div>
          {filteredTrips.length === 0 ? (
            <div className="dc-radar-wrap">
              <div className="dc-radar-ring"><Activity size={22} strokeWidth={1.5} /></div>
              <h3>No trips found</h3>
              <p>Adjust filters or dispatched trips will appear here.</p>
            </div>
          ) : (
            <div className="activity-feed">
              {filteredTrips.map(t => {
                const sc = TRIP_STATUS_COLOR[t.status] ?? { bg: 'rgba(107,90,224,0.12)', color: '#9C8CFF' };
                return (
                  <div className="activity-row" key={t.tripId}>
                    <span className="activity-dot" style={{ background: sc.color }} />
                    <div className="activity-text">
                      <strong>{t.source} → {t.destination}</strong>
                      <div style={{ fontSize: 12, color: 'var(--dc-text-faint)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                        {t.driver} · {t.vehicle}
                      </div>
                    </div>
                    <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Maintenance Alerts */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title font-grotesk">Maintenance Alerts</span>
            <Link to="/maintenance" style={{ fontSize: 12, color: 'var(--dc-red)', textDecoration: 'none', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
              VIEW ALL →
            </Link>
          </div>
          {filteredMaint.length === 0 ? (
            <div className="dc-radar-wrap">
              <div className="dc-radar-ring"><Wrench size={22} strokeWidth={1.5} /></div>
              <h3>All clear</h3>
              <p>No pending maintenance alerts at this time.</p>
            </div>
          ) : (
            <div className="activity-feed">
              {filteredMaint.map(r => {
                const pc = MAINT_PRIORITY_COLOR[r.priority] ?? { bg: 'rgba(107,90,224,0.12)', color: '#9C8CFF' };
                return (
                  <div className="activity-row" key={r.id}>
                    <span className="activity-dot" style={{ background: pc.color }} />
                    <div className="activity-text">
                      <strong>{r.vehicle}</strong>
                      <div style={{ fontSize: 12, color: 'var(--dc-text-faint)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                        {r.issue}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                      <span style={{ background: pc.bg, color: pc.color, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.8px' }}>
                        {r.priority?.toUpperCase()}
                      </span>
                      <span className="activity-ts">{r.dueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Dashboard;
