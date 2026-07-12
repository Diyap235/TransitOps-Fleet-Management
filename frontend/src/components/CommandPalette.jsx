import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Truck, UserRound, Route, Wrench, BarChart3,
  LayoutDashboard,
} from 'lucide-react';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers  } from '../api/drivers.api';
import { getTrips    } from '../api/trips.api';

// ── Static quick-jump actions — each has an explicit `to` path ───
const QUICK = [
  { label: 'Dashboard',   icon: LayoutDashboard, tag: 'PAGE', to: '/'            },
  { label: 'Vehicles',    icon: Truck,           tag: 'PAGE', to: '/vehicles'    },
  { label: 'Drivers',     icon: UserRound,       tag: 'PAGE', to: '/drivers'     },
  { label: 'Trips',       icon: Route,           tag: 'PAGE', to: '/trips'       },
  { label: 'Maintenance', icon: Wrench,          tag: 'PAGE', to: '/maintenance' },
  { label: 'Reports',     icon: BarChart3,       tag: 'PAGE', to: '/reports'     },
];

const match = (text = '', q = '') =>
  text.toLowerCase().includes(q.toLowerCase());

const CommandPalette = ({ open, onClose }) => {
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  const [query,    setQuery]    = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [trips,    setTrips]    = useState([]);
  const [focused,  setFocused]  = useState(0);

  // Load real data once when palette opens
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

  const q = query.trim();

  const quickResults = QUICK.filter(a => !q || match(a.label, q));

  const vehicleResults = vehicles
    .filter(v => !q || match(v.registrationNumber, q) || match(v.name, q))
    .slice(0, 5);

  const driverResults = drivers
    .filter(d => !q || match(d.name, q) || match(d.licenseNumber, q))
    .slice(0, 5);

  const tripResults = trips
    .filter(t =>
      !q ||
      match(t.source, q) ||
      match(t.destination, q) ||
      match(t.vehicle?.registrationNumber, q)
    )
    .slice(0, 5);

  // ── Flat list of items with resolved destination paths ───────────
  const allItems = [
    ...quickResults.map(a => ({
      icon:      a.icon,
      label:     a.label,
      tag:       a.tag,
      to:        a.to,
      tint:      'var(--dc-blue-bg)',
      iconColor: 'var(--dc-blue)',
    })),
    ...vehicleResults.map(v => ({
      icon:      Truck,
      label:     `${v.registrationNumber} — ${v.name}`,
      tag:       v.status ?? 'VEHICLE',
      to:        '/vehicles',          // navigates to Vehicles page
      tint:      'var(--dc-blue-bg)',
      iconColor: 'var(--dc-blue)',
    })),
    ...driverResults.map(d => ({
      icon:      UserRound,
      label:     d.name,
      tag:       d.status ?? 'DRIVER',
      to:        '/drivers',           // navigates to Drivers page
      tint:      'var(--dc-violet-bg)',
      iconColor: 'var(--dc-violet)',
    })),
    ...tripResults.map(t => ({
      icon:      Route,
      label:     `${t.source} → ${t.destination}`,
      tag:       t.status ?? 'TRIP',
      to:        '/trips',             // navigates to Trips page
      tint:      'var(--dc-teal-bg)',
      iconColor: 'var(--dc-teal)',
    })),
  ];

  // Single navigation handler — uses the item's own `to` field
  const go = useCallback((item) => {
    navigate(item.to);
    onClose();
  }, [navigate, onClose]);

  // Arrow key + Enter keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocused(f => Math.min(f + 1, allItems.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocused(f => Math.max(f - 1, 0));
      }
      if (e.key === 'Enter' && allItems[focused]) {
        go(allItems[focused]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, allItems, focused, go]);

  if (!open) return null;

  // ── Result row — receives the full item object and its flat index ─
  const Item = ({ item, idx }) => (
    <div
      className={`cmd-item${focused === idx ? ' focused' : ''}`}
      onMouseEnter={() => setFocused(idx)}
      onClick={() => go(item)}
    >
      <span
        className="cmd-item-icon"
        style={{ background: item.tint, color: item.iconColor }}
      >
        <item.icon size={14} strokeWidth={2} />
      </span>
      <span className="cmd-item-label">{item.label}</span>
      <span className="cmd-item-tag">{item.tag}</span>
    </div>
  );

  // ── Render grouped sections, tracking global flat index ──────────
  let idx = 0;
  const quickSlice   = allItems.slice(0, quickResults.length);
  const vehicleSlice = allItems.slice(quickResults.length, quickResults.length + vehicleResults.length);
  const driverSlice  = allItems.slice(quickResults.length + vehicleResults.length, quickResults.length + vehicleResults.length + driverResults.length);
  const tripSlice    = allItems.slice(quickResults.length + vehicleResults.length + driverResults.length);

  return (
    <div
      className="cmd-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
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
          {allItems.length === 0 && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}

          {quickSlice.length > 0 && (
            <>
              <div className="cmd-group-label">Quick Jump</div>
              {quickSlice.map((item) => {
                const i = idx++;
                return <Item key={item.to} item={item} idx={i} />;
              })}
            </>
          )}

          {vehicleSlice.length > 0 && (
            <>
              <div className="cmd-group-label">Vehicles</div>
              {vehicleSlice.map((item) => {
                const i = idx++;
                return <Item key={item.label} item={item} idx={i} />;
              })}
            </>
          )}

          {driverSlice.length > 0 && (
            <>
              <div className="cmd-group-label">Drivers</div>
              {driverSlice.map((item) => {
                const i = idx++;
                return <Item key={item.label} item={item} idx={i} />;
              })}
            </>
          )}

          {tripSlice.length > 0 && (
            <>
              <div className="cmd-group-label">Trips</div>
              {tripSlice.map((item) => {
                const i = idx++;
                return <Item key={item.label} item={item} idx={i} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
