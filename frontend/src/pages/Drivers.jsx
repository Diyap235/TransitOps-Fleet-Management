import React, { useEffect, useState } from 'react';
import { UserRound, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../api/drivers.api';

const STATUS_BADGE = { 'Available': 'badge-green', 'On Trip': 'badge-blue', 'Off Duty': 'badge-gray', 'Suspended': 'badge-red' };
const EMPTY_FORM = { name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '', safetyScore: 100, status: 'Available' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'e.g. Rajesh Kumar', col: 2 },
            { key: 'licenseNumber', label: 'License Number', placeholder: 'e.g. DL1234567890' },
            { key: 'licenseCategory', label: 'License Category', placeholder: 'e.g. HMV' },
            { key: 'licenseExpiryDate', label: 'License Expiry Date', type: 'date' },
            { key: 'contactNumber', label: 'Contact Number', placeholder: '+91 9876543210' },
            { key: 'safetyScore', label: 'Safety Score (0-100)', placeholder: '100', type: 'number' },
          ].map(({ key, label, placeholder, type, col }) => (
            <div className="form-group" style={{ marginBottom: 0, gridColumn: col === 2 ? '1 / -1' : undefined }} key={key}>
              <label className="form-label">{label}</label>
              <input className="form-control" type={type || 'text'} placeholder={placeholder}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required min={type === 'number' ? 0 : undefined} max={key === 'safetyScore' ? 100 : undefined} />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'Off Duty', 'Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}{loading ? 'Saving…' : 'Save Driver'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => { setLoading(true); getDrivers().then(res => setDrivers(res.data)).catch(() => {}).finally(() => setLoading(false)); };
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
      if (editing) await updateDriver(editing, form);
      else await createDriver(form);
      setModalOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save driver.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    try { await deleteDriver(id); load(); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Driver' : 'Add Driver'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} />}

      <div className="page-header">
        <div className="page-header-left"><h1>Drivers</h1><p>Manage drivers, licenses and safety scores.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />Add Driver</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Drivers ({filtered.length})</span>
          <div className="search-bar"><span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>License No.</th><th>Category</th><th>Expiry</th><th>Contact</th><th>Safety Score</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state">
                  <div className="empty-state-icon"><UserRound size={22} strokeWidth={1.5} /></div>
                  <h3>No drivers found</h3><p>Register drivers to assign them to trips.</p>
                  <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Driver</button>
                </div></td></tr>
              ) : filtered.map(d => {
                const score = d.safetyScore ?? 0;
                const sc = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
                return (
                  <tr key={d._id}>
                    <td className="td-primary">{d.name}</td>
                    <td>{d.licenseNumber}</td>
                    <td>{d.licenseCategory}</td>
                    <td>{new Date(d.licenseExpiryDate).toLocaleDateString()}</td>
                    <td>{d.contactNumber}</td>
                    <td><span style={{ fontWeight: 700, color: sc }}>{score}<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>/100</span></span></td>
                    <td><span className={`badge ${STATUS_BADGE[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                    <td><div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(d._id)} style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Drivers;
