import React, { useEffect, useState } from 'react';
import { Route, Plus, Pencil, Trash2, Search, X, AlertCircle, Grid3x3, List } from 'lucide-react';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../api/trips.api';
import { getVehicles } from '../api/vehicles.api';
import { getDrivers  } from '../api/drivers.api';
import { useToast } from '../context/ToastContext';

const STATUS_BADGE = {
  'Draft':      'badge-gray',
  'Dispatched': 'badge-blue',
  'Completed':  'badge-teal',
  'Cancelled':  'badge-red',
};

const EMPTY_FORM = { source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error, vehicles, drivers }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
<<<<<<< HEAD
    <div style={{ 
      background: 'rgba(30, 36, 51, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: 14, 
      width: '100%', 
      maxWidth: 540, 
      boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      border: '1px solid rgba(76, 141, 255, 0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(45, 53, 72, 0.6)' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#E2E8F0' }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B95A7' }}><X size={18} /></button>
=======
    <div style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Source</label>
            <input className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} placeholder="e.g. Mumbai" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Destination</label>
            <input className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} placeholder="e.g. Pune" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required />
          </div>
          {form.source && form.destination && (
            <div style={{ gridColumn: '1 / -1', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 6 }}>
                💡 Smart Dispatch
              </div>
              <div style={{ fontSize: 11, color: '#C4CEDC', marginTop: 4 }}>
                Ready to dispatch: {vehicles.filter(v => v.status === 'Available').length} vehicles available, {drivers.filter(d => d.status === 'Available').length} drivers available
              </div>
            </div>
          )}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Vehicle</label>
            <select className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} required>
              <option value="">Select vehicle</option>
              {vehicles.filter(v => v.status === 'Available').map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Driver</label>
            <select className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} value={form.driver} onChange={e => setForm(f => ({ ...f, driver: e.target.value }))} required>
              <option value="">Select driver</option>
              {drivers.filter(d => d.status === 'Available').map(d => <option key={d._id} value={d._id}>{d.name} — {d.licenseNumber}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Cargo Weight (kg)</label>
            <input className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} type="number" placeholder="0" min="0" value={form.cargoWeight} onChange={e => setForm(f => ({ ...f, cargoWeight: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: '#C4CEDC' }}>Planned Distance (km)</label>
            <input className="form-control" style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }} type="number" placeholder="100" min="0" value={form.plannedDistance} onChange={e => setForm(f => ({ ...f, plannedDistance: e.target.value }))} required />
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
  const toast = useToast();
  const [trips,     setTrips]     = useState([]);
  const [vehicles,  setVehicles]  = useState([]);
  const [drivers,   setDrivers]   = useState([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
<<<<<<< HEAD
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
=======
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994

  const load = () => {
    setLoading(true);
    Promise.all([getTrips(), getVehicles(), getDrivers()])
      .then(([t, v, d]) => { setTrips(t.data); setVehicles(v.data); setDrivers(d.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ source: t.source, destination: t.destination, vehicle: t.vehicle?._id || '', driver: t.driver?._id || '', cargoWeight: t.cargoWeight, plannedDistance: t.plannedDistance });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateTrip(editing, form);
        toast.success('Trip updated', `${form.source} → ${form.destination}`);
      } else {
        await createTrip(form);
        toast.success('Trip created', `${form.source} → ${form.destination}`);
      }
      setModalOpen(false); load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save trip.';
      setError(msg);
      toast.error('Save failed', msg);
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (trip, newStatus) => {
    try {
      await updateTrip(trip._id, { status: newStatus });
      const label = `${trip.source} → ${trip.destination}`;
      if (newStatus === 'Dispatched') toast.info('Trip dispatched',  label);
      if (newStatus === 'Completed')  toast.success('Trip completed', label);
      if (newStatus === 'Cancelled')  toast.warning('Trip cancelled', label);
      load();
    } catch (err) {
      toast.error('Status update failed', err.response?.data?.message || 'Could not update status.');
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await deleteTrip(t._id);
      toast.warning('Trip deleted', `${t.source} → ${t.destination}`);
      load();
    } catch (err) {
      toast.error('Delete failed', err.response?.data?.message || 'Could not delete trip.');
    }
  };

  const filtered = trips.filter(t =>
    t.source?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase()) ||
    t.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ '--page-accent': 'var(--dc-teal)', '--page-accent-bg': 'var(--dc-teal-bg)' }}>
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Trip' : 'New Trip'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form} setForm={setForm}
          loading={saving} error={error}
          vehicles={vehicles} drivers={drivers}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Trips</h1>
          <p>
            {trips.length} total &nbsp;·&nbsp;
            {trips.filter(t => t.status === 'Dispatched').length} active &nbsp;·&nbsp;
            {trips.filter(t => t.status === 'Completed').length} completed
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />New Trip</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Trips ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search trips…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button 
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban view"
            >
              <Grid3x3 size={14} strokeWidth={2} />
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
              title="List view"
            >
              <List size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
<<<<<<< HEAD
        {viewMode === 'table' ? (
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
        ) : (
          <div style={{ padding: 20, overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, minWidth: '1000px' }}>
                {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map(status => {
                  const statusTrips = filtered.filter(t => t.status === status);
                  return (
                    <div key={status} style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      maxHeight: '600px',
                      overflowY: 'auto',
                    }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <span className={`badge ${STATUS_BADGE[status]}`}>{status}</span>
                        <span style={{ background: 'rgba(226,232,240,0.6)', padding: '2px 8px', borderRadius: '99px', fontSize: 11, fontWeight: 700 }}>{statusTrips.length}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {statusTrips.map(t => (
                          <div key={t._id} style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(226, 232, 240, 0.6)',
                            borderRadius: 'var(--radius)',
                            padding: 12,
                            fontSize: 12,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          onClick={() => openEdit(t)}
                          >
                            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.source} → {t.destination}</div>
                            <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>🚗 {t.vehicle?.registrationNumber || 'No vehicle'}</div>
                            <div style={{ color: 'var(--text-muted)', marginTop: 3 }}>👤 {t.driver?.name || 'No driver'}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(226,232,240,0.3)', justifyContent: 'flex-end' }}>
                              {t.status === 'Draft' && <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: 10 }} onClick={(e) => { e.stopPropagation(); handleStatusChange(t, 'Dispatched'); }}>Dispatch</button>}
                              {t.status === 'Dispatched' && <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: 10, color: 'var(--success)' }} onClick={(e) => { e.stopPropagation(); handleStatusChange(t, 'Completed'); }}>Complete</button>}
                            </div>
                          </div>
                        ))}
                        {statusTrips.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 12 }}>No trips</div>
                        )}
                      </div>
=======
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo (kg)</th>
                <th>Distance (km)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Loading trips...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Route size={22} strokeWidth={1.5} /></div>
                    <h3>No trips found</h3>
                    <p>Create a trip to dispatch a vehicle and driver.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />New Trip</button>
                  </div>
                </td></tr>
              ) : filtered.map(t => (
                <tr key={t._id}>
                  <td className="td-primary">
                    {t.source}
                    <span style={{ color: 'var(--dc-text-faint)', fontWeight: 400, margin: '0 4px' }}>→</span>
                    {t.destination}
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{t.vehicle?.registrationNumber ?? '—'}</td>
                  <td>{t.driver?.name ?? <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{t.cargoWeight}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{t.plannedDistance}</td>
                  <td><span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-gray'}`}>{t.status}</span></td>
                  <td>
                    <div className="row-actions" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {t.status === 'Draft'      && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--dc-blue)'  }} onClick={() => handleStatusChange(t, 'Dispatched')}>Dispatch</button>}
                      {t.status === 'Dispatched' && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--dc-teal)'  }} onClick={() => handleStatusChange(t, 'Completed')}>Complete</button>}
                      {(t.status === 'Draft' || t.status === 'Dispatched') &&
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--dc-amber)' }} onClick={() => handleStatusChange(t, 'Cancelled')}>Cancel</button>}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t)} style={{ color: 'var(--dc-red)' }}><Trash2 size={13} /></button>
>>>>>>> 9a771b436abc12df3e7b5dff1390cbde0050b994
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
