import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { Truck, UserRound, Route, Wrench, BarChart3, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vehicles, drivers, trips, maintenanceRecords } from '../data/dummyData';

// ── helpers ───────────────────────────────────────────────────────
const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort();

const regionOf = (loc = '') => {
  const parts = loc.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : loc.trim();
};

// Derive vehicle type from model string (first word)
const typeOf = (model = '') => model.split(' ')[0];

// ── color tokens ─────────────────────────────────────────────────
const ACCENT = {
  blue:   { icon: '#2563EB', bg: '#EFF6FF', border: '#2563EB' },
  teal:   { icon: '#0D9488', bg: '#F0FDF9', border: '#0D9488' },
  green:  { icon: '#16A34A', bg: '#F0FDF4', border: '#16A34A' },
  violet: { icon: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED' },
  amber:  { icon: '#D97706', bg: '#FFFBEB', border: '#D97706' },
  orange: { icon: '#EA580C', bg: '#FFF7ED', border: '#EA580C' },
  sky:    { icon: '#0284C7', bg: '#F0F9FF', border: '#0284C7' },
};
=======
import { Truck, UserRound, Route, Wrench, BarChart3, Activity, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardStats, trips, maintenanceRecords, vehicles } from '../data/dummyData';
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b

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

<<<<<<< HEAD
const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    Icon: Truck,     color: 'blue'   },
  { to: '/drivers',     label: 'Drivers',     Icon: UserRound, color: 'violet' },
  { to: '/trips',       label: 'Trips',       Icon: Route,     color: 'teal'   },
  { to: '/maintenance', label: 'Maintenance', Icon: Wrench,    color: 'amber'  },
  { to: '/reports',     label: 'Reports',     Icon: BarChart3, color: 'sky'    },
];

// ── StatCard ──────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, color, sub }) => {
  const c = ACCENT[color] ?? ACCENT.blue;
  return (
    <div className="stat-card" style={{ borderTop: `2px solid ${c.border}` }}>
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: c.bg, color: c.icon }}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <div className="stat-card-value" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
        {value}
      </div>
      <div className="stat-card-label">{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.5px' }}>
          {sub}
        </div>
      )}
    </div>
  );
};

// ── FilterSelect ──────────────────────────────────────────────────
const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
      whiteSpace: 'nowrap', fontFamily: "'Space Grotesk',sans-serif" }}>
      {label}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        height: 32, padding: '0 28px 0 10px', border: '1px solid var(--border)',
        borderRadius: 20, fontSize: 12, fontFamily: "'Inter',sans-serif",
        background: 'var(--surface)', color: 'var(--text)', outline: 'none',
        cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
      }}
    >
      <option value="">All</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ─────────────────────────────────────────────────────────────────
=======
const QUICK_ACTIONS = [
  { to: '/vehicles',    label: 'Vehicles',    sub: 'FLEET REGISTRY', Icon: Truck,     accent: 'var(--dc-blue)',   accentBg: 'var(--dc-blue-bg)'   },
  { to: '/drivers',     label: 'Drivers',     sub: 'CREW ROSTER',    Icon: UserRound, accent: 'var(--dc-violet)', accentBg: 'var(--dc-violet-bg)' },
  { to: '/trips',       label: 'Trips',       sub: 'ROUTE LOG',      Icon: Route,     accent: 'var(--dc-teal)',   accentBg: 'var(--dc-teal-bg)'   },
  { to: '/maintenance', label: 'Maintenance', sub: 'SERVICE DESK',   Icon: Wrench,    accent: 'var(--dc-red)',    accentBg: 'var(--dc-red-bg)'    },
  { to: '/reports',     label: 'Reports',     sub: 'ANALYTICS',      Icon: BarChart3, accent: 'var(--dc-reports)',accentBg: 'var(--dc-reports-bg)'},
];

const recentTrips = trips.slice(0, 5);
const recentMaint = maintenanceRecords.slice(0, 5);

>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
const Dashboard = () => {
  const { user } = useAuth();
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

<<<<<<< HEAD
  // ── filter state ───────────────────────────────────────────────
  const [filterType,   setFilterType]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const hasFilters = filterType || filterStatus || filterRegion;

  // ── derive dropdown options from data ─────────────────────────
  const typeOptions   = useMemo(() => uniq(vehicles.map(v => typeOf(v.model))), []);
  const statusOptions = ['Available', 'On Trip', 'Maintenance'];
  const regionOptions = useMemo(() => uniq(vehicles.map(v => regionOf(v.location))), []);

  // ── filtered vehicle base ──────────────────────────────────────
  const filteredVehicles = useMemo(() => vehicles.filter(v => {
    if (filterType   && typeOf(v.model)      !== filterType)   return false;
    if (filterStatus && v.status             !== filterStatus) return false;
    if (filterRegion && regionOf(v.location) !== filterRegion) return false;
    return true;
  }), [filterType, filterStatus, filterRegion]);

  // ── KPI counts derived from filteredVehicles ───────────────────
  const kpis = useMemo(() => {
    const total       = filteredVehicles.length;
    const active      = filteredVehicles.filter(v => v.status === 'On Trip').length;
    const available   = filteredVehicles.filter(v => v.status === 'Available').length;
    const inShop      = filteredVehicles.filter(v => v.status === 'Maintenance' || v.status === 'In Shop').length;
    const utilization = total > 0 ? Math.round((active / total) * 100) : 0;

    // Trip KPIs: filter by vehicles in the filtered set
    const filteredRegNos = new Set(filteredVehicles.map(v => v.registrationNumber));
    const scopedTrips = hasFilters
      ? trips.filter(t => filteredRegNos.has(t.vehicle))
      : trips;
    const activeTrips  = scopedTrips.filter(t => t.status === 'Dispatched').length;
    const pendingTrips = scopedTrips.filter(t => t.status === 'Draft').length;

    // Drivers on duty = drivers currently On Trip and assigned to a filtered vehicle
    const assignedDrivers = new Set(filteredVehicles.filter(v => v.status === 'On Trip').map(v => v.driver));
    const driversOnDuty   = hasFilters
      ? drivers.filter(d => d.status === 'On Trip' && assignedDrivers.has(d.name)).length
      : drivers.filter(d => d.status === 'On Trip').length;

    return { total, active, available, inShop, utilization, activeTrips, pendingTrips, driversOnDuty };
  }, [filteredVehicles, hasFilters]);

  // ── filtered Recent Trips & Maintenance ───────────────────────
  const filteredRegNos = useMemo(
    () => new Set(filteredVehicles.map(v => v.registrationNumber)),
    [filteredVehicles]
  );

  const recentTrips = useMemo(() => {
    const base = hasFilters ? trips.filter(t => filteredRegNos.has(t.vehicle)) : trips;
    return base.slice(0, 5);
  }, [filteredRegNos, hasFilters]);

  const recentMaint = useMemo(() => {
    const base = hasFilters
      ? maintenanceRecords.filter(r => filteredRegNos.has(r.vehicle))
      : maintenanceRecords;
    return base.slice(0, 5);
  }, [filteredRegNos, hasFilters]);

  const STAT_CARDS = [
    { label: 'Active Vehicles',      value: kpis.active,       Icon: Truck,     color: 'teal',   sub: 'Currently on trip'     },
    { label: 'Available Vehicles',   value: kpis.available,    Icon: Truck,     color: 'green',  sub: 'Ready to dispatch'      },
    { label: 'In Maintenance',       value: kpis.inShop,       Icon: Wrench,    color: 'amber',  sub: 'In shop / servicing'    },
    { label: 'Active Trips',         value: kpis.activeTrips,  Icon: Route,     color: 'blue',   sub: 'Dispatched & running'   },
    { label: 'Pending Trips',        value: kpis.pendingTrips, Icon: Route,     color: 'orange', sub: 'Draft — not dispatched' },
    { label: 'Drivers On Duty',      value: kpis.driversOnDuty,Icon: UserRound, color: 'violet', sub: 'Currently driving'      },
    { label: 'Fleet Utilization',    value: `${kpis.utilization}%`, Icon: BarChart3, color: 'sky', sub: 'Active ÷ Total' },
=======
  // Compute KPIs from actual data
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const vehiclesInMaintenance = vehicles.filter(v => v.status === 'In Shop' || v.status === 'Maintenance').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;

  // Extended STAT_CARDS with missing KPIs
  const COMPUTED_STAT_CARDS = [
    { label: 'Total Vehicles',        caption: 'FLEET REGISTRY',     value: dashboardStats.totalVehicles,    Icon: Truck,       accent: 'var(--dc-blue)',   accentBg: 'var(--dc-blue-bg)'   },
    { label: 'Available Vehicles',    caption: 'READY FOR DISPATCH', value: availableVehicles,               Icon: CheckCircle, accent: 'var(--dc-green)',  accentBg: 'var(--dc-green-bg)'  },
    { label: 'Vehicles in Maintenance', caption: 'SERVICE QUEUE',   value: vehiclesInMaintenance,           Icon: Wrench,      accent: 'var(--dc-orange)', accentBg: 'var(--dc-orange-bg)' },
    { label: 'Active Trips',          caption: 'ROUTE LOG',          value: dashboardStats.activeTrips,      Icon: Route,       accent: 'var(--dc-teal)',   accentBg: 'var(--dc-teal-bg)'   },
    { label: 'Drivers Available',     caption: 'CREW ROSTER',        value: dashboardStats.driversAvailable, Icon: UserRound,  accent: 'var(--dc-violet)', accentBg: 'var(--dc-violet-bg)' },
    { label: 'Open Maintenance',      caption: 'SERVICE DESK',       value: dashboardStats.openMaintenance,  Icon: TrendingUp,  accent: 'var(--dc-red)',    accentBg: 'var(--dc-red-bg)'    },
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
  ];

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

<<<<<<< HEAD
      {/* ── Filter row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        padding: '10px 0', marginBottom: 16,
      }}>
        <FilterSelect label="Vehicle Type" value={filterType}   onChange={setFilterType}   options={typeOptions}   />
        <FilterSelect label="Status"       value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect label="Region"       value={filterRegion} onChange={setFilterRegion} options={regionOptions} />
        {hasFilters && (
          <button
            onClick={() => { setFilterType(''); setFilterStatus(''); setFilterRegion(''); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 32, padding: '0 12px', border: '1px solid var(--border)',
              borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'var(--gray-100)', color: 'var(--text-muted)',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            <X size={12} strokeWidth={2.5} />
            Clear filters
          </button>
        )}
        {hasFilters && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
            {filteredVehicles.length} / {vehicles.length} vehicles
          </span>
        )}
      </div>

      {/* ── KPI strip — 4 top, 3 bottom ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {STAT_CARDS.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* ── Quick actions ── */}
=======
      {/* ── Quick Actions ── */}
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title font-grotesk">Quick Actions</span>
        </div>
        <div className="card-body">
<<<<<<< HEAD
          <div className="quick-action-grid">
            {QUICK.map(({ to, label, Icon, color }) => {
              const c = ACCENT[color] ?? ACCENT.blue;
              return (
                <Link key={to} to={to} className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: c.bg, color: c.icon }}>
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <span className="quick-action-label">{label}</span>
                </Link>
              );
            })}
=======
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
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Trips */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
<<<<<<< HEAD
            <span className="card-title">Recent Trips</span>
            <Link to="/trips" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Route</th><th>Driver</th><th>Status</th></tr></thead>
              <tbody>
                {recentTrips.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                    No trips match current filters.
                  </td></tr>
                ) : recentTrips.map(t => {
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
=======
            <span className="card-title font-grotesk">Recent Trips</span>
            <Link to="/trips" style={{ fontSize: 12, color: 'var(--dc-blue)', textDecoration: 'none', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
              VIEW ALL →
            </Link>
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
          </div>
          {recentTrips.length === 0 ? (
            <div className="dc-radar-wrap">
              <div className="dc-radar-ring"><Activity size={22} strokeWidth={1.5} /></div>
              <h3>No activity yet</h3>
              <p>Recent trips will appear here once dispatched.</p>
            </div>
          ) : (
            <div className="activity-feed">
              {recentTrips.map(t => {
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
<<<<<<< HEAD
        <div className="card">
          <div className="card-header">
            <span className="card-title">Maintenance Alerts</span>
            <Link to="/maintenance" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vehicle</th><th>Issue</th><th>Priority</th></tr></thead>
              <tbody>
                {recentMaint.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                    No alerts match current filters.
                  </td></tr>
                ) : recentMaint.map(r => {
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
=======
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title font-grotesk">Maintenance Alerts</span>
            <Link to="/maintenance" style={{ fontSize: 12, color: 'var(--dc-red)', textDecoration: 'none', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
              VIEW ALL →
            </Link>
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
          </div>
          {recentMaint.length === 0 ? (
            <div className="dc-radar-wrap">
              <div className="dc-radar-ring"><Wrench size={22} strokeWidth={1.5} /></div>
              <h3>All clear</h3>
              <p>No pending maintenance alerts at this time.</p>
            </div>
          ) : (
            <div className="activity-feed">
              {recentMaint.map(r => {
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
