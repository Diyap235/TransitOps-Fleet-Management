import React, { useState } from 'react';
import { UserRound, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { drivers as dummyDrivers } from '../data/dummyData';
import { createDriver, updateDriver, deleteDriver } from '../api/drivers.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'Off Duty':  'badge-gray',
  'Suspended': 'badge-red',
};

const EMPTY_FORM = { name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '', safetyScore: 100, status: 'Available' };

const StarRating = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <span style={{ color: '#F59E0B', fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: '#6B7280', fontSize: 11, marginLeft: 4 }}>{rating}</span>
    </span>
  );
};

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Full Name</label>
          <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
            type="text" placeholder="e.g. Rajesh Kumar" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'licenseNumber',   label: 'License Number',   placeholder: 'MH0120150012345' },
            { key: 'licenseCategory', label: 'License Category', placeholder: 'HMV' },
            { key: 'contactNumber',   label: 'Contact Number',   placeholder: '+91 9876543210' },
            { key: 'safetyScore',     label: 'Safety Score',     placeholder: '100', type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>{label}</label>
              <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
                type={type || 'text'} placeholder={placeholder} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required min={type === 'number' ? 0 : undefined} max={key === 'safetyScore' ? 100 : undefined} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>License Expiry</label>
            <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
              type="date" value={form.licenseExpiryDate} onChange={e => setForm(f => ({ ...f, licenseExpiryDate: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Status</label>
            <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'Off Duty', 'Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 7, background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            {loading && <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
            {loading ? 'Saving…' : 'Save Driver'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Drivers = () => {
  const [drivers, setDrivers]     = useState(dummyDrivers.map(d => ({ ...d, _id: d.id })));
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (d) => {
    setEditing(d._id);
    setForm({ name: d.name, licenseNumber: d.licenseNumber, licenseCategory: d.licenseCategory || '', licenseExpiryDate: '', contactNumber: d.phone || '', safetyScore: d.safetyScore || 100, status: d.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateDriver(editing, form);
        setDrivers(ds => ds.map(d => d._id === editing ? { ...d, ...form } : d));
      } else {
        const res = await createDriver(form);
        setDrivers(ds => [{ ...res.data, _id: res.data._id }, ...ds]);
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save driver.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    try { await deleteDriver(id); setDrivers(ds => ds.filter(d => d._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Driver' : 'Add Driver'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Drivers</h1>
          <p>Managing {drivers.length} drivers across your fleet.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} strokeWidth={2.5} />Add Driver</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Drivers ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search by name or license…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>License No.</th><th>Contact</th><th>Experience</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><UserRound size={22} strokeWidth={1.5} /></div>
                    <h3>No drivers found</h3>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Driver</button>
                  </div>
                </td></tr>
              ) : filtered.map(d => (
                <tr key={d._id}>
                  <td className="td-primary">{d.name}</td>
                  <td style={{ fontSize: 12, color: '#4B5563' }}>{d.licenseNumber}</td>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{d.phone || d.contactNumber || '—'}</td>
                  <td style={{ fontSize: 12 }}>{d.experience ? `${d.experience} yrs` : '—'}</td>
                  <td><StarRating rating={d.rating || (d.safetyScore / 20) || 4.0} /></td>
                  <td><span className={`badge ${STATUS_BADGE[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(d._id)} style={{ color: '#DC2626' }}><Trash2 size={13} /></button>
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

export default Drivers;
