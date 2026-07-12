import React, { useEffect, useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, Search, X, AlertCircle, Calendar } from 'lucide-react';
import { getMaintenanceRecords, createMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } from '../api/maintenance.api';
import { getVehicles } from '../api/vehicles.api';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = { vehicle: '', description: '', cost: '', date: '', status: 'Active' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error, vehicles, isEdit }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 500, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
        <div className="form-group">
          <label className="form-label">Vehicle</label>
          <select className="form-control" value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} required>
            <option value="">Select vehicle</option>
            {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-control" placeholder="e.g. Engine oil change and filter replacement" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cost</label>
            <input className="form-control" type="number" placeholder="5000" min="0" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input className="form-control" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
        </div>
        {isEdit && (
          <div className="form-group" style={{ marginTop: 14 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option>Active</option>
              <option>Closed</option>
            </select>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}{loading ? 'Saving…' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Maintenance = () => {
  const toast = useToast();
  const [records,   setRecords]   = useState([]);
  const [vehicles,  setVehicles]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getMaintenanceRecords(), getVehicles()])
      .then(([r, v]) => { setRecords(r.data); setVehicles(v.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    const d = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    setForm({ vehicle: r.vehicle?._id || '', description: r.description, cost: r.cost, date: d, status: r.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateMaintenanceRecord(editing, form);
        toast.success('Record updated', form.description);
      } else {
        await createMaintenanceRecord(form);
        toast.success('Maintenance logged', form.description);
      }
      setModalOpen(false); load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save record.';
      setError(msg);
      toast.error('Save failed', msg);
    } finally { setSaving(false); }
  };

  const handleClose = async (r) => {
    try {
      await updateMaintenanceRecord(r._id, { status: 'Closed' });
      toast.success('Record closed', r.description);
      load();
    } catch (err) {
      toast.error('Failed to close', err.response?.data?.message || 'Could not close record.');
    }
  };

  const handleDelete = async (r) => {
    if (!window.confirm('Delete this maintenance record?')) return;
    try {
      await deleteMaintenanceRecord(r._id);
      toast.warning('Record deleted', r.description);
      load();
    } catch (err) {
      toast.error('Delete failed', err.response?.data?.message || 'Could not delete record.');
    }
  };

  const filtered = records.filter(r =>
    r.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = records.filter(r => r.status === 'Active').length;

  return (
    <div style={{ '--page-accent': 'var(--dc-amber)', '--page-accent-bg': 'var(--dc-amber-bg)' }}>
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Record' : 'Log Maintenance'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form} setForm={setForm}
          loading={saving} error={error}
          vehicles={vehicles} isEdit={!!editing}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Maintenance</h1>
          <p>
            {records.length} total &nbsp;·&nbsp;
            {activeCount} active &nbsp;·&nbsp;
            {records.length - activeCount} closed
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />Log Maintenance</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Records ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search records…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Loading maintenance records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Wrench size={22} strokeWidth={1.5} /></div>
                    <h3>No maintenance records</h3>
                    <p>Log vehicle maintenance to track service history.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Log Maintenance</button>
                  </div>
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td className="td-primary" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                    {r.vehicle?.registrationNumber ?? '—'}
                  </td>
                  <td>{r.description}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                    ₹{Number(r.cost).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                      <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                      {new Date(r.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    {/* Active = amber (page accent / caution); Closed = teal (resolved) */}
                    <span className={r.status === 'Active' ? 'badge badge-amber' : 'badge badge-teal'}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {r.status === 'Active' && (
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--dc-teal)' }} onClick={() => handleClose(r)}>Close</button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r)} style={{ color: 'var(--dc-red)' }}><Trash2 size={13} /></button>
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

export default Maintenance;
