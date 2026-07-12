import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, UserRound, Route, Wrench, BarChart3, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Stat card config ──────────────────────────────────────────────
const STATS = [
  { label: 'Total Vehicles',    value: '—', icon: Truck,     accentVar: '--dc-blue',   bgVar: '--dc-blue-bg'   },
  { label: 'Active Trips',      value: '—', icon: Route,     accentVar: '--dc-teal',   bgVar: '--dc-teal-bg'   },
  { label: 'Drivers Available', value: '—', icon: UserRound, accentVar: '--dc-violet', bgVar: '--dc-violet-bg' },
  { label: 'Open Maintenance',  value: '—', icon: Wrench,    accentVar: '--dc-amber',  bgVar: '--dc-amber-bg'  },
];

// ── Quick-action config ───────────────────────────────────────────
const QUICK = [
  { to: '/vehicles',    label: 'Vehicles',    sub: 'FLEET REGISTRY', Icon: Truck,     accent: '--dc-blue',   accentBg: '--dc-blue-bg'   },
  { to: '/drivers',     label: 'Drivers',     sub: 'CREW ROSTER',    Icon: UserRound, accent: '--dc-violet', accentBg: '--dc-violet-bg' },
  { to: '/trips',       label: 'Trips',       sub: 'ROUTE LOG',      Icon: Route,     accent: '--dc-teal',   accentBg: '--dc-teal-bg'   },
  { to: '/maintenance', label: 'Maintenance', sub: 'SERVICE DESK',   Icon: Wrench,    accent: '--dc-amber',  accentBg: '--dc-amber-bg'  },
  { to: '/reports',     label: 'Reports',     sub: 'ANALYTICS',      Icon: BarChart3, accent: '--dc-reports',accentBg: '--dc-reports-bg'},
];

// ── Mock activity feed ────────────────────────────────────────────
const ACTIVITY = [
  { color: 'var(--dc-teal)',   text: <><strong>Trip #T-0041</strong> dispatched — Mumbai → Pune</>,          ts: '2 min ago'  },
  { color: 'var(--dc-amber)',  text: <><strong>MH12AB1234</strong> flagged for scheduled service</>,          ts: '14 min ago' },
  { color: 'var(--dc-blue)',   text: <>Driver <strong>Rajesh Kumar</strong> assigned to route R-17</>,        ts: '31 min ago' },
  { color: 'var(--dc-violet)', text: <><strong>Trip #T-0040</strong> completed — 312 km logged</>,            ts: '1 hr ago'   },
  { color: 'var(--dc-teal)',   text: <><strong>MH14CD5678</strong> status updated to Active</>,               ts: '2 hr ago'   },
  { color: 'var(--dc-red)',    text: <>Maintenance record <strong>#M-009</strong> marked overdue</>,           ts: '3 hr ago'   },
];

// ── useCountUp: animates a numeric value 0 → target over ~700ms ───
const useCountUp = (target, active = true) => {
  const ref  = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active || typeof target !== 'number') return;
    const start    = performance.now();
    const duration = 700;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active]);

  return ref;
};

// ── StatCard with animated value ──────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accentVar, bgVar }) => {
  const numeric   = typeof value === 'number';
  const countRef  = useCountUp(numeric ? value : 0, numeric);

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
        {numeric
          ? <span ref={countRef}>0</span>
          : '— —'}
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

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    // Set --page-accent to blue at container level
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

      {/* ── Stat cards + animated connector rail ── */}
      <div className="dc-connector-wrap" style={{ marginBottom: 24 }}>
        <svg className="dc-connector-svg" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
          <line className="dc-connector-line" x1="0" y1="12" x2="1000" y2="12" />
        </svg>
        <div className="stats-grid">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
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
                style={{ '--dc-card-accent': `var(${accent})`, '--dc-card-accent-bg': `var(${accentBg})` }}
              >
                <div className="dc-quick-icon"><Icon size={17} strokeWidth={2} /></div>
                <span className="dc-quick-label">{label}</span>
                <span className="dc-quick-sub">{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity — populated feed ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Recent Activity
            <span className="live-badge"><span className="live-badge-dot" />LIVE</span>
          </span>
        </div>
        <div className="activity-feed">
          {ACTIVITY.map((row, i) => (
            <div key={i} className="activity-row">
              <span className="activity-dot" style={{ background: row.color }} />
              <span className="activity-text">{row.text}</span>
              <span className="activity-ts">{row.ts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
