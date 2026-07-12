import React, { useEffect, useState } from 'react';
import { Route, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../api/trips.api';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers } from '../api/drivers.api';

const STATUS_BADGE = { 'Draft': 'badge-gray', 'Dispatched': 'badge-blue', 'Completed': 'badge-green', 'Cancelled': 'badge-red' };
const EMPTY_FORM = { source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error, vehicles, drivers }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Source</label>
            <input className="form-control" placeholder="e.g. Mumbai" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Destination</label>
            <input className="form-control" placeholder="e.g. Pune" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Vehicle</label>
            <select className="form-control" value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} required>
              <option value="">Select vehicle</option>
              {vehicles.filter(v => v.status === 'Available').map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Driver</label>
            <select className="form-control" value={form.driver} onChange={e => setForm(f => ({ ...f, driver: e.target.value }))} required>
              <option value="">Select driver</option>
              {drivers.filter(d => d.status === 'Available').map(d => <option key={d._id} value={d._id}>{d.name} — {d.licenseNumber}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cargo Weight (kg)</label>
            <input className="form-control" type="number" placeholder="0" min="0" value={form.cargoWeight} onChange={e => setForm(f => ({ ...f, cargoWeight: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Planned Distance (km)</label>
            <input className="form-control" type="number" placeholder="100" min="0" value={form.plannedDistance} onChange={e => setForm(f => ({ ...f, plannedDistance: e.target.value }))} required />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}{loading ? 'Saving…' : 'Save Trip'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getTrips(), getVehicles(), getDrivers()])
      .then(([t, v, d]) => { setTrips(t.data); setVehicles(v.data); setDrivers(d.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ source: t.source, destination: t.destination, vehicle: t.vehicle?._id || '', driver: t.driver?._id || '', cargoWeight: t.cargoWeight, plannedDistance: t.plannedDistance });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) await updateTrip(editing, form);
      else await createTrip(form);
      setModalOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save trip.'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (trip, newStatus) => {
    try { await updateTrip(trip._id, { status: newStatus }); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try { await deleteTrip(id); load(); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = trips.filter(t =>
    t.source?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase()) ||
    t.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Trip' : 'New Trip'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} vehicles={vehicles} drivers={drivers} />}

      <div className="page-header">
        <div className="page-header-left"><h1>Trips</h1><p>Dispatch, monitor and complete fleet trips.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />New Trip</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Trips ({filtered.length})</span>
          <div className="search-bar"><span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Route</th><th>Vehicle</th><th>Driver</th><th>Cargo (kg)</th><th>Distance (km)</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state">
                  <div className="empty-state-icon"><Route size={22} strokeWidth={1.5} /></div>
                  <h3>No trips found</h3><p>Create a trip to dispatch a vehicle and driver.</p>
                  <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />New Trip</button>
                </div></td></tr>
              ) : filtered.map(t => (
                <tr key={t._id}>
                  <td className="td-primary">{t.source} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>→</span> {t.destination}</td>
                  <td>{t.vehicle?.registrationNumber ?? '—'}</td>
                  <td>{t.driver?.name ?? '—'}</td>
                  <td>{t.cargoWeight}</td>
                  <td>{t.plannedDistance}</td>
                  <td><span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-gray'}`}>{t.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {t.status === 'Draft' && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }} onClick={() => handleStatusChange(t, 'Dispatched')}>Dispatch</button>}
                      {t.status === 'Dispatched' && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)' }} onClick={() => handleStatusChange(t, 'Completed')}>Complete</button>}
                      {(t.status === 'Draft' || t.status === 'Dispatched') && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--warning)' }} onClick={() => handleStatusChange(t, 'Cancelled')}>Cancel</button>}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t._id)} style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
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
