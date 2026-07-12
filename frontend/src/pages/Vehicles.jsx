import React, { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search, X, AlertCircle, MoreHorizontal } from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles.api';
import { useToast } from '../context/ToastContext';

// ── Semantic status config ────────────────────────────────────────
const STATUS_CFG = {
  'Available':  { cls: 'badge-teal',   dot: 'var(--dc-teal)',   label: 'Active'      },
  'On Trip':    { cls: 'badge-blue',   dot: 'var(--dc-blue)',   label: 'En Route', pulse: true },
  'In Shop':    { cls: 'badge-amber',  dot: 'var(--dc-amber)',  label: 'Maintenance' },
  'Retired':    { cls: 'badge-gray',                            label: 'Retired'     },
};

// ── Fuel bar ──────────────────────────────────────────────────────
const FuelBar = ({ level = 75 }) => {
  const pct   = Math.max(0, Math.min(100, level));
  const color = pct > 50 ? 'var(--dc-teal)' : pct > 20 ? 'var(--dc-amber)' : 'var(--dc-red)';
  return (
    <div className="fuel-bar-wrap">
      <div className="fuel-bar-track">
        <div className="fuel-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="fuel-bar-label">{pct}%</span>
    </div>
  );
};

// ── Driver avatar chip ────────────────────────────────────────────
const DriverChip = ({ driver }) => {
  if (!driver?.name) return <span className="driver-chip-unassigned">Unassigned</span>;
  const initials = driver.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <span className="driver-chip">
      <span className="driver-chip-avatar">{initials}</span>
      <span className="driver-chip-name">{driver.name}</span>
    </span>
  );
};

// ── Status badge (semantic) ────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg  = STATUS_CFG[status] ?? { cls: 'badge-gray', label: status };
  return (
    <span className={`badge ${cfg.cls}`} style={{ gap: 6 }}>
      {cfg.dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: cfg.dot, flexShrink: 0,
          animation: cfg.pulse ? 'live-pulse 1.6s ease-in-out infinite' : undefined,
          display: 'inline-block',
        }} />
      )}
      {cfg.label ?? status}
    </span>
  );
};

// ── Filter chips ──────────────────────────────────────────────────
const FILTERS = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

const EMPTY_FORM = {
  registrationNumber: '', name: '', type: '',
  maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available',
};

// ── Modal ─────────────────────────────────────────────────────────
const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'registrationNumber', label: 'Registration Number', placeholder: 'e.g. MH12AB1234' },
            { key: 'name',               label: 'Vehicle Name',        placeholder: 'e.g. Tata Prima 4928' },
            { key: 'type',               label: 'Type',                placeholder: 'e.g. Heavy Truck' },
            { key: 'maxLoadCapacity',    label: 'Max Load (kg)',        placeholder: '10000', type: 'number' },
            { key: 'odometer',           label: 'Odometer (km)',        placeholder: '0',     type: 'number' },
            { key: 'acquisitionCost',    label: 'Acquisition Cost',     placeholder: '500000',type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div className="form-group" style={{ marginBottom: 0 }} key={key}>
              <label className="form-label">{label}</label>
              <input className="form-control" type={type || 'text'} placeholder={placeholder}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'In Shop', 'Retired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}{loading ? 'Saving…' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────
const Vehicles = () => {
  const toast = useToast();
  const [vehicles,   setVehicles]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('All');
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  const load = () => {
    setLoading(true);
    getVehicles().then(res => setVehicles(res.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (v) => {
    setEditing(v._id);
    setForm({ registrationNumber: v.registrationNumber, name: v.name, type: v.type, maxLoadCapacity: v.maxLoadCapacity, odometer: v.odometer, acquisitionCost: v.acquisitionCost, status: v.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing, form);
        toast.success('Vehicle updated', form.registrationNumber);
      } else {
        await createVehicle(form);
        toast.success('Vehicle added', form.registrationNumber);
      }
      setModalOpen(false); load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save vehicle.';
      setError(msg);
      toast.error('Save failed', msg);
    } finally { setSaving(false); }
  };

  const handleDelete = async (v) => {
    if (!window.confirm(`Delete ${v.registrationNumber}?`)) return;
    try {
      await deleteVehicle(v._id);
      toast.warning('Vehicle removed', v.registrationNumber);
      load();
    } catch (err) {
      toast.error('Delete failed', err.response?.data?.message || 'Could not delete vehicle.');
    }
  };

  // counts per status for chips
  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? vehicles.length : vehicles.filter(v => v.status === f).length;
    return acc;
  }, {});

  const filtered = vehicles.filter(v => {
    const matchesFilter = filter === 'All' || v.status === filter;
    const matchesSearch =
      v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    // --page-accent = blue (vehicles = core registry, stays brand blue)
    <div style={{ '--page-accent': 'var(--dc-blue)', '--page-accent-bg': 'var(--dc-blue-bg)' }}>
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Vehicle' : 'Add Vehicle'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form} setForm={setForm}
          loading={saving} error={error}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Vehicles</h1>
          <p>
            {vehicles.length} total &nbsp;·&nbsp;
            {vehicles.filter(v => v.status === 'Available').length} available &nbsp;·&nbsp;
            {vehicles.filter(v => v.status === 'On Trip').length} on trip
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={15} strokeWidth={2.5} />Add Vehicle
        </button>
      </div>

      <div className="card">
        {/* ── Filter chips + search row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="filter-chips" style={{ padding: 0, border: 'none', gap: 6 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`chip${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="chip-count">({counts[f]})</span>
              </button>
            ))}
          </div>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search vehicles…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Name / Type</th>
                <th>Driver</th>
                <th>Odometer</th>
                <th>Fuel</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Truck size={22} strokeWidth={1.5} /></div>
                    <h3>No vehicles found</h3>
                    <p>Add your first vehicle to start managing your fleet.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Vehicle</button>
                  </div>
                </td></tr>
              ) : filtered.map(v => (
                <tr key={v._id}>
                  <td className="td-primary" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                    {v.registrationNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--dc-text)', fontSize: 13 }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--dc-text-faint)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.5px', textTransform: 'uppercase' }}>{v.type}</div>
                  </td>
                  <td><DriverChip driver={v.driver} /></td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                    {Number(v.odometer).toLocaleString()} km
                  </td>
                  <td><FuelBar level={v.fuelLevel ?? 75} /></td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>
                    <div className="row-actions" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)} title="Edit"><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v)} title="Delete" style={{ color: 'var(--dc-red)' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
