import React, { useEffect, useState } from 'react';
import { UserRound, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../api/drivers.api';
import { useToast } from '../context/ToastContext';

const STATUS_BADGE = {
  'Available': 'badge-teal',
  'On Trip':   'badge-blue',
  'Off Duty':  'badge-gray',
  'Suspended': 'badge-red',
};

const EMPTY_FORM = {
  name: '', licenseNumber: '', licenseCategory: '',
  licenseExpiryDate: '', contactNumber: '', safetyScore: 100, status: 'Available',
};

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--danger-light)', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Full Name</label>
          <input className="form-control" type="text" placeholder="e.g. Rajesh Kumar" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label className="form-label">License Number</label>
            <input className="form-control" type="text" placeholder="e.g. DL1234567890" value={form.licenseNumber}
              onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">License Category</label>
            <input className="form-control" type="text" placeholder="e.g. HMV" value={form.licenseCategory}
              onChange={e => setForm(f => ({ ...f, licenseCategory: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">License Expiry Date</label>
            <input className="form-control" type="date" value={form.licenseExpiryDate}
              onChange={e => setForm(f => ({ ...f, licenseExpiryDate: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">Contact Number</label>
            <input className="form-control" type="text" placeholder="+91 9876543210" value={form.contactNumber}
              onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">Safety Score (0–100)</label>
            <input className="form-control" type="number" placeholder="100" min="0" max="100" value={form.safetyScore}
              onChange={e => setForm(f => ({ ...f, safetyScore: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'Off Duty', 'Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Saving…' : 'Save Driver'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Drivers = () => {
  const toast = useToast();
  const [drivers,    setDrivers]    = useState([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  const load = () => {
    setLoading(true);
    getDrivers().then(res => setDrivers(res.data)).catch(() => setDrivers([])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (d) => {
    setEditing(d._id);
    const expiry = d.licenseExpiryDate ? new Date(d.licenseExpiryDate).toISOString().split('T')[0] : '';
    setForm({ name: d.name, licenseNumber: d.licenseNumber, licenseCategory: d.licenseCategory, licenseExpiryDate: expiry, contactNumber: d.contactNumber, safetyScore: d.safetyScore, status: d.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateDriver(editing, form);
        toast.success('Driver updated', form.name);
      } else {
        await createDriver(form);
        toast.success('Driver registered', form.name);
      }
      setModalOpen(false); load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save driver.';
      setError(msg);
      toast.error('Save failed', msg);
    } finally { setSaving(false); }
  };

  const handleDelete = async (d) => {
    if (!window.confirm('Delete this driver?')) return;
    try {
      await deleteDriver(d._id);
      toast.warning('Driver removed', d.name);
      load();
    } catch (err) {
      toast.error('Delete failed', err.response?.data?.message || 'Could not delete driver.');
    }
  };

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ '--page-accent': 'var(--dc-violet)', '--page-accent-bg': 'var(--dc-violet-bg)' }}>
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Driver' : 'Add Driver'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form} setForm={setForm}
          loading={saving} error={error}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Drivers</h1>
          <p>
            {drivers.length} total &nbsp;·&nbsp;
            {drivers.filter(d => d.status === 'Available').length} available &nbsp;·&nbsp;
            {drivers.filter(d => d.status === 'On Trip').length} on trip
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={15} strokeWidth={2.5} />Add Driver
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Drivers ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search drivers…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Category</th>
                <th>Expiry</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Loading drivers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><UserRound size={22} strokeWidth={1.5} /></div>
                    <h3>No drivers found</h3>
                    <p>Register your drivers to assign them to trips.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add Driver</button>
                  </div>
                </td></tr>
              ) : filtered.map(d => {
                const score = d.safetyScore ?? 0;
                const scoreColor = score >= 80 ? 'var(--dc-teal)' : score >= 60 ? 'var(--dc-amber)' : 'var(--dc-red)';
                return (
                  <tr key={d._id}>
                    <td>
                      <span className="driver-chip">
                        <span className="driver-chip-avatar">{d.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}</span>
                        <span className="td-primary">{d.name}</span>
                      </span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{d.licenseNumber}</td>
                    <td>{d.licenseCategory}</td>
                    <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{new Date(d.licenseExpiryDate).toLocaleDateString()}</td>
                    <td>{d.contactNumber}</td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: scoreColor, fontSize: 13 }}>
                        {score}<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                      </span>
                    </td>
                    <td><span className={`badge ${STATUS_BADGE[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                    <td>
                      <div className="row-actions" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)} title="Edit"><Pencil size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(d)} title="Delete" style={{ color: 'var(--dc-red)' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
