<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3,
  TrendingUp, TrendingDown, AlertCircle,
=======
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3, Activity,
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers } from '../api/drivers.api';
import { getTrips } from '../api/trips.api';
import { getMaintenanceRecords } from '../api/maintenance.api';

<<<<<<< HEAD
// Skeleton loader component
const SkeletonStat = () => (
  <div className="stat-card" style={{ opacity: 0.6 }}>
    <div className="stat-card-header">
      <div className="stat-card-icon" style={{ background: '#E5E7EB', height: 38, width: 38 }}></div>
    </div>
    <div className="stat-card-value" style={{ background: '#E5E7EB', height: 24, width: 60, borderRadius: 4 }}></div>
    <div className="stat-card-label" style={{ background: '#E5E7EB', height: 12, width: 80, borderRadius: 4, marginTop: 8 }}></div>
  </div>
);

// StatCard component
const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  const COLOR_MAP = {
    blue:   { icon: '#2563EB', bg: '#EFF6FF' },
    green:  { icon: '#16A34A', bg: '#F0FDF4' },
    orange: { icon: '#D97706', bg: '#FFFBEB' },
    red:    { icon: '#DC2626', bg: '#FEE2E2' },
    purple: { icon: '#7C3AED', bg: '#F5F3FF' },
  };

  const c = COLOR_MAP[color];
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: c.bg, color: c.icon }}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

=======
// ── Quick-action config ───────────────────────────────────────────
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    sub: 'FLEET REGISTRY', Icon: Truck,     accent: '--dc-blue',    accentBg: '--dc-blue-bg'    },
  { to: '/drivers',     label: 'Drivers',     sub: 'CREW ROSTER',    Icon: UserRound, accent: '--dc-violet',  accentBg: '--dc-violet-bg'  },
  { to: '/trips',       label: 'Trips',       sub: 'ROUTE LOG',      Icon: Route,     accent: '--dc-teal',    accentBg: '--dc-teal-bg'    },
  { to: '/maintenance', label: 'Maintenance', sub: 'SERVICE DESK',   Icon: Wrench,    accent: '--dc-amber',   accentBg: '--dc-amber-bg'   },
  { to: '/reports',     label: 'Reports',     sub: 'ANALYTICS',      Icon: BarChart3, accent: '--dc-reports', accentBg: '--dc-reports-bg' },
];

// ── Mock activity feed (shown while real data loads or as fallback) ─
const ACTIVITY = [
  { color: 'var(--dc-teal)',   text: <><strong>Trip #T-0041</strong> dispatched — Mumbai → Pune</>,        ts: '2 min ago'  },
  { color: 'var(--dc-amber)',  text: <><strong>MH12AB1234</strong> flagged for scheduled service</>,        ts: '14 min ago' },
  { color: 'var(--dc-blue)',   text: <>Driver <strong>Rajesh Kumar</strong> assigned to route R-17</>,      ts: '31 min ago' },
  { color: 'var(--dc-violet)', text: <><strong>Trip #T-0040</strong> completed — 312 km logged</>,          ts: '1 hr ago'   },
  { color: 'var(--dc-teal)',   text: <><strong>MH14CD5678</strong> status updated to Active</>,             ts: '2 hr ago'   },
  { color: 'var(--dc-red)',    text: <>Maintenance record <strong>#M-009</strong> marked overdue</>,         ts: '3 hr ago'   },
];

// ── useCountUp: animates 0 → target over ~700ms via RAF ──────────
const useCountUp = (target, active = true) => {
  const ref    = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active || typeof target !== 'number') return;
    const start    = performance.now();
    const duration = 700;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      if (ref.current) ref.current.textContent = Math.round(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active]);

  return ref;
};

// ── StatCard with count-up animation ─────────────────────────────
const StatCard = ({ label, value, icon: Icon, accentVar, bgVar }) => {
  const numeric  = typeof value === 'number';
  const countRef = useCountUp(numeric ? value : 0, numeric);

  return (
    <div
      className="dc-stat-card"
      style={{ '--dc-accent': `var(${accentVar})`, '--dc-accent-bg': `var(${bgVar})` }}
    >
      <div className="dc-stat-dot" />
      <div className="dc-icon-chip">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="dc-stat-value">
        {numeric ? <span ref={countRef}>0</span> : '— —'}
      </div>
      <div className="dc-stat-label">{label}</div>
      <div className="dc-stat-caption">
        {numeric ? 'LIVE DATA' : 'AWAITING SYNC'}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: null,
    activeTrips: null,
    driversAvailable: null,
    openMaintenance: null,
    fleetUtilization: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [driversWithExpiringLicenses, setDriversWithExpiringLicenses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesRes, driversRes, tripsRes, maintenanceRes] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getTrips(),
        getMaintenanceRecords(),
      ]);

      const vehicles = vehiclesRes.data || [];
      const drivers = driversRes.data || [];
      const trips = tripsRes.data || [];
      const maintenance = maintenanceRes.data || [];

      // Calculate KPIs
      const totalVehicles = vehicles.length;
      const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
      const driversAvailable = drivers.filter(d => d.status === 'Available').length;
      const openMaintenance = maintenance.filter(m => m.status === 'Active').length;
      const onTripVehicles = vehicles.filter(v => v.status === 'On Trip').length;
      const fleetUtilization = totalVehicles > 0 ? ((onTripVehicles / totalVehicles) * 100).toFixed(1) : 0;

      setStats({
        totalVehicles,
        activeTrips,
        driversAvailable,
        openMaintenance,
        fleetUtilization,
      });

      // Build recent activity feed
      const activity = [];
      
      // Add recent trips
      trips.slice(0, 3).forEach(trip => {
        activity.push({
          id: trip._id,
          type: 'trip',
          title: `Trip ${trip.source} → ${trip.destination}`,
          status: trip.status,
          timestamp: trip.createdAt,
          icon: Route,
        });
      });

      // Add recent maintenance
      maintenance.slice(0, 2).forEach(m => {
        activity.push({
          id: m._id,
          type: 'maintenance',
          title: `${m.vehicle?.name || 'Vehicle'} maintenance`,
          status: m.status,
          timestamp: m.date,
          icon: Wrench,
        });
      });

      // Sort by timestamp and keep top 5
      activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivity(activity.slice(0, 5));

      // Check for expiring licenses (within 30 days)
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiringDrivers = drivers.filter(d => {
        const expiryDate = new Date(d.licenseExpiryDate);
        return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
      });
      setDriversWithExpiringLicenses(expiringDrivers);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Live stat counts fetched from API
  const [stats, setStats] = useState({
    vehicles:    '—',
    trips:       '—',
    drivers:     '—',
    maintenance: '—',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      getVehicles(),
      getDrivers(),
      getTrips(),
      getMaintenanceRecords(),
    ]).then(([vehicles, drivers, trips, maint]) => {
      setStats({
        vehicles:    vehicles.status    === 'fulfilled' ? vehicles.value.data.length    : '—',
        drivers:     drivers.status     === 'fulfilled'
          ? drivers.value.data.filter(d => d.status === 'Available').length
          : '—',
        trips:       trips.status       === 'fulfilled'
          ? trips.value.data.filter(t => t.status === 'Dispatched').length
          : '—',
        maintenance: maint.status       === 'fulfilled'
          ? maint.value.data.filter(m => m.status === 'Active').length
          : '—',
      });
    }).finally(() => setLoading(false));
  }, []);

  const dataLoadFailed = !loading && [stats.vehicles, stats.drivers, stats.trips, stats.maintenance].every(val => val === '—');

  // Build STATS array with live values for StatCard
  const STATS = [
    { label: 'Total Vehicles',    value: stats.vehicles,    icon: Truck,     accentVar: '--dc-blue',   bgVar: '--dc-blue-bg'   },
    { label: 'Active Trips',      value: stats.trips,       icon: Route,     accentVar: '--dc-teal',   bgVar: '--dc-teal-bg'   },
    { label: 'Drivers Available', value: stats.drivers,     icon: UserRound, accentVar: '--dc-violet', bgVar: '--dc-violet-bg' },
    { label: 'Open Maintenance',  value: stats.maintenance, icon: Wrench,    accentVar: '--dc-amber',  bgVar: '--dc-amber-bg'  },
  ];

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ '--page-accent': 'var(--dc-blue)', '--page-accent-bg': 'var(--dc-blue-bg)' }}>

      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'}
            <span className="live-badge">
              <span className="live-badge-dot" />
              LIVE
            </span>
          </h1>
          <p>Here is what is happening with your fleet today.</p>
        </div>
      </div>

<<<<<<< HEAD
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <AlertCircle size={16} />
          {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchDashboardData} style={{ marginLeft: 'auto' }}>Retry</button>
        </div>
      )}

      {/* License Expiry Alerts */}
      {!loading && driversWithExpiringLicenses.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <strong>⚠️ License Expiry Alert:</strong>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {driversWithExpiringLicenses.length} driver(s) have licenses expiring within 30 days:
              {driversWithExpiringLicenses.map(d => <div key={d._id}>{d.name} (expires {new Date(d.licenseExpiryDate).toLocaleDateString()})</div>)}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard
              label="Total Vehicles"
              value={stats.totalVehicles}
              icon={Truck}
              color="blue"
              trend={null}
            />
            <StatCard
              label="Active Trips"
              value={stats.activeTrips}
              icon={Route}
              color="green"
              trend={null}
            />
            <StatCard
              label="Drivers Available"
              value={stats.driversAvailable}
              icon={UserRound}
              color="purple"
              trend={null}
            />
            <StatCard
              label="Open Maintenance"
              value={stats.openMaintenance}
              icon={Wrench}
              color="orange"
              trend={null}
            />
          </>
        )}
=======
      {/* ── Stat cards + animated SVG connector rail ── */}
      <div className="dc-connector-wrap" style={{ marginBottom: 24 }}>
        <svg
          className="dc-connector-svg"
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line className="dc-connector-line" x1="0" y1="12" x2="1000" y2="12" />
        </svg>
        <div className="stats-grid">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
      </div>

      {dataLoadFailed && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="empty-state">
            <div className="empty-state-icon"><BarChart3 size={22} strokeWidth={1.5} /></div>
            <h3>No analytics data available</h3>
            <p>Sync your fleet data to see live dashboard metrics and activity.</p>
          </div>
        </div>
      )}

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
                <div className="dc-quick-icon"><Icon size={17} strokeWidth={2} /></div>
                <span className="dc-quick-label">{label}</span>
                <span className="dc-quick-sub">{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity feed ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Recent Activity
            <span className="live-badge"><span className="live-badge-dot" />LIVE</span>
          </span>
        </div>
<<<<<<< HEAD
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Loading activity...</div>
        ) : recentActivity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BarChart3 size={22} strokeWidth={1.5} />
            </div>
            <h3>No activity yet</h3>
            <p>Recent trips, maintenance events, and alerts will appear here.</p>
          </div>
        ) : (
          <div style={{ padding: 0 }}>
            {recentActivity.map((item, idx) => {
              const Icon = item.icon;
              const isLast = idx === recentActivity.length - 1;
              return (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 20px',
                  borderBottom: isLast ? 'none' : '1px solid rgba(226, 232, 240, 0.4)',
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius)',
                    background: item.type === 'trip' ? 'linear-gradient(135deg, #DBEAFE, #E0F2FE)' : 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                    color: item.type === 'trip' ? '#1D4ED8' : '#B45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{
                    padding: '3px 10px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }} className={`badge badge-${item.status === 'Dispatched' || item.status === 'Active' ? 'blue' : item.status === 'Completed' ? 'green' : 'gray'}`}>
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
=======
        <div className="activity-feed">
          {ACTIVITY.map((row, i) => (
            <div key={i} className="activity-row">
              <span className="activity-dot" style={{ background: row.color }} />
              <span className="activity-text">{row.text}</span>
              <span className="activity-ts">{row.ts}</span>
            </div>
          ))}
        </div>
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
      </div>

    </div>
  );
};

export default Dashboard;
