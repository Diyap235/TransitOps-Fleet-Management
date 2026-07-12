import React, { useState } from 'react';
import { Route, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { trips as dummyTrips } from '../data/dummyData';
import { createTrip, updateTrip, deleteTrip } from '../api/trips.api';

const STATUS_BADGE = {
  'Draft':      'badge-gray',
  'Dispatched': 'badge-blue',
  'Completed':  'badge-green',
  'Cancelled':  'badge-red',
};

const EMPTY_FORM = { source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'source',          label: 'Source',              placeholder: 'e.g. Mumbai' },
            { key: 'destination',     label: 'Destination',         placeholder: 'e.g. Pune' },
            { key: 'vehicle',         label: 'Vehicle Reg. No.',    placeholder: 'e.g. MH12AB1234' },
            { key: 'driver',          label: 'Driver Name',         placeholder: 'e.g. Rajesh Kumar' },
            { key: 'cargoWeight',     label: 'Cargo Weight (kg)',   placeholder: '0', type: 'number' },
            { key: 'plannedDistance', label: 'Distance (km)',        placeholder: '100', type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>{label}</label>
              <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
                type={type || 'text'} placeholder={placeholder} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required={key !== 'cargoWeight'} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 7, background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            {loading && <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
            {loading ? 'Saving…' : 'Save Trip'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Trips = () => {
  const [trips, setTrips]         = useState(dummyTrips.map(t => ({ ...t, _id: t.tripId })));
  const [search, setSearch]       = useState('');
  const [statusFilter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ source: t.source, destination: t.destination, vehicle: t.vehicle || '', driver: t.driver || '', cargoWeight: '', plannedDistance: t.distance || '' });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateTrip(editing, form);
        setTrips(ts => ts.map(t => t._id === editing ? { ...t, ...form } : t));
      } else {
        const newTrip = { ...form, _id: `T-${Date.now()}`, tripId: `T-${Date.now()}`, status: 'Draft', startDate: new Date().toISOString().split('T')[0] };
        try { const res = await createTrip(form); setTrips(ts => [{ ...res.data, _id: res.data._id }, ...ts]); }
        catch { setTrips(ts => [newTrip, ...ts]); }
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save trip.'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = (id, newStatus) => {
    // Update UI immediately regardless of backend result
    setTrips(ts => ts.map(t => t._id === id ? { ...t, status: newStatus } : t));
    // Fire backend call silently — dummy IDs will fail but UI is already updated
    updateTrip(id, { status: newStatus }).catch(() => {});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    setTrips(ts => ts.filter(t => t._id !== id));
    deleteTrip(id).catch(() => {});
  };

  const filtered = trips.filter(t =>
    (statusFilter === 'All' || t.status === statusFilter) &&
    (t.source?.toLowerCase().includes(search.toLowerCase()) ||
     t.destination?.toLowerCase().includes(search.toLowerCase()) ||
     t.driver?.toLowerCase().includes(search.toLowerCase()) ||
     t.vehicle?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Trip' : 'New Trip'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Trips</h1>
          <p>{trips.length} trips total · {trips.filter(t => t.status === 'Dispatched').length} active</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />New Trip</button>
      </div>

      {/* Status filter tabs */}
      <div className="tab-bar">
        {['All', 'Dispatched', 'Draft', 'Completed', 'Cancelled'].map(s => (
          <button key={s} className={`tab-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {s} {s !== 'All' && <span style={{ marginLeft: 4, background: s === statusFilter ? '#DBEAFE' : '#F1F5F9', color: s === statusFilter ? '#1D4ED8' : '#6B7280', borderRadius: 99, padding: '0 6px', fontSize: 11, fontWeight: 600 }}>{trips.filter(t => t.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Trips ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search route, driver, vehicle…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Trip ID</th><th>Route</th><th>Driver</th><th>Vehicle</th><th>Distance</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Route size={22} strokeWidth={1.5} /></div>
                    <h3>No trips found</h3>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />New Trip</button>
                  </div>
                </td></tr>
              ) : filtered.map(t => (
                <tr key={t._id}>
                  <td style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>{t.tripId || t._id}</td>
                  <td className="td-primary">{t.source} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>→</span> {t.destination}</td>
                  <td style={{ fontSize: 13, color: '#4B5563' }}>{t.driver}</td>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{t.vehicle}</td>
                  <td style={{ fontSize: 13 }}>{t.distance || t.plannedDistance} km</td>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{t.startDate}</td>
                  <td><span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-gray'}`}>{t.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {t.status === 'Draft'      && <button className="btn btn-ghost btn-sm" style={{ color: '#2563EB' }} onClick={() => handleStatusChange(t._id, 'Dispatched')}>Dispatch</button>}
                      {t.status === 'Dispatched' && <button className="btn btn-ghost btn-sm" style={{ color: '#16A34A' }} onClick={() => handleStatusChange(t._id, 'Completed')}>Complete</button>}
                      {(t.status === 'Draft' || t.status === 'Dispatched') && <button className="btn btn-ghost btn-sm" style={{ color: '#D97706' }} onClick={() => handleStatusChange(t._id, 'Cancelled')}>Cancel</button>}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t._id)} style={{ color: '#DC2626' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Trips;
