import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers } from '../api/drivers.api';
import { getTrips } from '../api/trips.api';
import { getMaintenanceRecords } from '../api/maintenance.api';

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
const StatCard = ({ label, value, icon: Icon, color }) => {
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

// ── Quick-action config ───────────────────────────────────────────
const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    sub: 'FLEET REGISTRY', Icon: Truck,     accent: 'var(--dc-blue)',    accentBg: 'var(--dc-blue-bg)'    },
  { to: '/drivers',     label: 'Drivers',     sub: 'CREW ROSTER',    Icon: UserRound, accent: 'var(--dc-violet)',  accentBg: 'var(--dc-violet-bg)'  },
  { to: '/trips',       label: 'Trips',       sub: 'ROUTE LOG',      Icon: Route,     accent: 'var(--dc-teal)',    accentBg: 'var(--dc-teal-bg)'    },
  { to: '/maintenance', label: 'Maintenance', sub: 'SERVICE DESK',   Icon: Wrench,    accent: 'var(--dc-amber)',   accentBg: 'var(--dc-amber-bg)'   },
  { to: '/reports',     label: 'Reports',     sub: 'ANALYTICS',      Icon: BarChart3, accent: 'var(--dc-reports)', accentBg: 'var(--dc-reports-bg)' },
];

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

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard label="Total Vehicles" value={stats.totalVehicles} icon={Truck} color="blue" />
            <StatCard label="Active Trips" value={stats.activeTrips} icon={Route} color="green" />
            <StatCard label="Drivers Available" value={stats.driversAvailable} icon={UserRound} color="purple" />
            <StatCard label="Open Maintenance" value={stats.openMaintenance} icon={Wrench} color="orange" />
          </>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title font-grotesk">Quick Actions</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {QUICK.map(({ to, label, sub, Icon, accent, accentBg }) => (
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
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <span className="card-title font-grotesk">Recent Activity</span>
        </div>
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
      </div>
    </>
  );
};

export default Dashboard;
