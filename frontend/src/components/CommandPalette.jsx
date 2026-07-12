import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Truck, UserRound, Route, Wrench, BarChart3,
  LayoutDashboard, X,
} from 'lucide-react';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers  } from '../api/drivers.api';
import { getTrips    } from '../api/trips.api';

// ── Static quick-jump actions ─────────────────────────────────────
const QUICK = [
  { label: 'Dashboard',   icon: LayoutDashboard, tag: 'PAGE',      to: '/'            },
  { label: 'Vehicles',    icon: Truck,           tag: 'PAGE',      to: '/vehicles'    },
  { label: 'Drivers',     icon: UserRound,       tag: 'PAGE',      to: '/drivers'     },
  { label: 'Trips',       icon: Route,           tag: 'PAGE',      to: '/trips'       },
  { label: 'Maintenance', icon: Wrench,          tag: 'PAGE',      to: '/maintenance' },
  { label: 'Reports',     icon: BarChart3,       tag: 'PAGE',      to: '/reports'     },
];

// ── Helpers ───────────────────────────────────────────────────────
const match = (text = '', q = '') =>
  text.toLowerCase().includes(q.toLowerCase());

const CommandPalette = ({ open, onClose }) => {
  const navigate   = useNavigate();
  const inputRef   = useRef(null);
  const [query, setQuery]       = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [trips,    setTrips]    = useState([]);
  const [focused,  setFocused]  = useState(0);

  // Load data once when palette opens
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setFocused(0);
    setTimeout(() => inputRef.current?.focus(), 60);
    Promise.all([getVehicles(), getDrivers(), getTrips()])
      .then(([v, d, t]) => {
        setVehicles(v.data ?? []);
        setDrivers(d.data  ?? []);
        setTrips(t.data    ?? []);
      })
      .catch(() => {});
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Build filtered result groups
  const q = query.trim();

  const quickResults = QUICK.filter(a =>
    !q || match(a.label, q)
  );

  const vehicleResults = vehicles.filter(v =>
    !q || match(v.registrationNumber, q) || match(v.name, q)
  ).slice(0, 5);

  const driverResults = drivers.filter(d =>
    !q || match(d.name, q) || match(d.licenseNumber, q)
  ).slice(0, 5);

  const tripResults = trips.filter(t =>
    !q || match(t.source, q) || match(t.destination, q) ||
    match(t.vehicle?.registrationNumber, q)
  ).slice(0, 5);

  // Flatten for keyboard nav
  const allItems = [
    ...quickResults.map(a   => ({ type: 'quick',   data: a })),
    ...vehicleResults.map(v => ({ type: 'vehicle', data: v })),
    ...driverResults.map(d  => ({ type: 'driver',  data: d })),
    ...tripResults.map(t    => ({ type: 'trip',    data: t })),
  ];

  const go = useCallback((item) => {
    if (item.type === 'quick')   { navigate(item.data.to); }
    if (item.type === 'vehicle') { navigate('/vehicles'); }
    if (item.type === 'driver')  { navigate('/drivers');  }
    if (item.type === 'trip')    { navigate('/trips');    }
    onClose();
  }, [navigate, onClose]);

  // Arrow key + Enter navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, allItems.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
      if (e.key === 'Enter' && allItems[focused]) go(allItems[focused]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, allItems, focused, go]);

  if (!open) return null;

  // Helper to render a single result item
  let globalIdx = 0;
  const Item = ({ icon: Icon, label, tag, tint = 'var(--dc-blue-bg)', iconColor = 'var(--dc-blue)' }) => {
    const idx = globalIdx++;
    return (
      <div
        className={`cmd-item${focused === idx ? ' focused' : ''}`}
        onMouseEnter={() => setFocused(idx)}
        onClick={() => go(allItems[idx])}
      >
        <span className="cmd-item-icon" style={{ background: tint, color: iconColor }}>
          <Icon size={14} strokeWidth={2} />
        </span>
        <span className="cmd-item-label">{label}</span>
        <span className="cmd-item-tag">{tag}</span>
      </div>
    );
  };

  const hasAnyResult = allItems.length > 0;

  return (
    <div className="cmd-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmd-panel" role="dialog" aria-label="Command Palette" aria-modal="true">

        {/* Input row */}
        <div className="cmd-input-row">
          <Search size={16} strokeWidth={2} />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Search or jump to…"
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(0); }}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="cmd-esc-hint">ESC</span>
        </div>

        {/* Results */}
        <div className="cmd-results">
          {!hasAnyResult && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}

          {quickResults.length > 0 && (
            <>
              <div className="cmd-group-label">Quick Jump</div>
              {quickResults.map(a => (
                <Item key={a.to} icon={a.icon} label={a.label} tag={a.tag} />
              ))}
            </>
          )}

          {vehicleResults.length > 0 && (
            <>
              <div className="cmd-group-label">Vehicles</div>
              {vehicleResults.map(v => (
                <Item
                  key={v._id}
                  icon={Truck}
                  label={`${v.registrationNumber} — ${v.name}`}
                  tag={v.status ?? 'VEHICLE'}
                  tint="var(--dc-blue-bg)"
                  iconColor="var(--dc-blue)"
                />
              ))}
            </>
          )}

          {driverResults.length > 0 && (
            <>
              <div className="cmd-group-label">Drivers</div>
              {driverResults.map(d => (
                <Item
                  key={d._id}
                  icon={UserRound}
                  label={d.name}
                  tag={d.status ?? 'DRIVER'}
                  tint="var(--dc-violet-bg)"
                  iconColor="var(--dc-violet)"
                />
              ))}
            </>
          )}

          {tripResults.length > 0 && (
            <>
              <div className="cmd-group-label">Trips</div>
              {tripResults.map(t => (
                <Item
                  key={t._id}
                  icon={Route}
                  label={`${t.source} → ${t.destination}`}
                  tag={t.status ?? 'TRIP'}
                  tint="var(--dc-teal-bg)"
                  iconColor="var(--dc-teal)"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
