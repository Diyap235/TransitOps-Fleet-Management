import React, { useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, Search, X, AlertCircle, Calendar } from 'lucide-react';
import { maintenanceRecords as dummyRecords } from '../data/dummyData';
import { createMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } from '../api/maintenance.api';

const PRIORITY_BADGE = { 'High': 'badge-red', 'Medium': 'badge-orange', 'Low': 'badge-green' };
const STATUS_BADGE   = { 'In Progress': 'badge-blue', 'Scheduled': 'badge-gray', 'Overdue': 'badge-red', 'Completed': 'badge-green' };

const EMPTY_FORM = { vehicle: '', description: '', cost: '', date: '', status: 'Active' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error, isEdit }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 500, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Vehicle Reg. No.</label>
          <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
            placeholder="e.g. MH12AB1234" value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Issue / Description</label>
          <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
            placeholder="e.g. Engine oil change" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Cost (₹)</label>
            <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
              type="number" placeholder="5000" min="0" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Due Date</label>
            <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
              type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
        </div>
        {isEdit && (
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Status</label>
            <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Active', 'Closed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 7, background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            {loading && <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
            {loading ? 'Saving…' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Maintenance = () => {
  const [records, setRecords]     = useState(dummyRecords.map(r => ({ ...r, _id: r.id, description: r.issue, cost: 0 })));
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ vehicle: r.vehicle, description: r.description || r.issue, cost: r.cost || '', date: r.dueDate || '', status: r.status === 'Completed' ? 'Closed' : 'Active' });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateMaintenanceRecord(editing, { ...form, description: form.description });
        setRecords(rs => rs.map(r => r._id === editing ? { ...r, ...form, issue: form.description } : r));
      } else {
        const newRec = { ...form, _id: `M-${Date.now()}`, id: `M-${Date.now()}`, issue: form.description, priority: 'Medium', status: 'Scheduled', dueDate: form.date };
        try { const res = await createMaintenanceRecord(form); setRecords(rs => [{ ...res.data, _id: res.data._id }, ...rs]); }
        catch { setRecords(rs => [newRec, ...rs]); }
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save record.'); }
    finally { setSaving(false); }
  };

  const handleClose = (id) => {
    setRecords(rs => rs.map(r => r._id === id ? { ...r, status: 'Completed' } : r));
    updateMaintenanceRecord(id, { status: 'Closed' }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this record?')) return;
    setRecords(rs => rs.filter(r => r._id !== id));
    deleteMaintenanceRecord(id).catch(() => {});
  };

  const filtered = records.filter(r =>
    r.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
    (r.issue || r.description)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Record' : 'Log Maintenance'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} isEdit={!!editing} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Maintenance</h1>
          <p>{records.filter(r => r.status !== 'Completed').length} open records across your fleet.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} />Log Maintenance</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Records ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search vehicle or issue…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Vehicle</th><th>Issue</th><th>Priority</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Wrench size={22} strokeWidth={1.5} /></div>
                    <h3>No maintenance records</h3>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Log Maintenance</button>
                  </div>
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>{r.id || r._id}</td>
                  <td className="td-primary">{r.vehicle}</td>
                  <td style={{ fontSize: 13, color: '#4B5563', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.issue || r.description}</td>
                  <td><span className={`badge ${PRIORITY_BADGE[r.priority] ?? 'badge-gray'}`}>{r.priority || '—'}</span></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B7280' }}>
                      <Calendar size={12} />{r.dueDate || r.date || '—'}
                    </span>
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[r.status] ?? 'badge-gray'}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {r.status !== 'Completed' && <button className="btn btn-ghost btn-sm" style={{ color: '#16A34A' }} onClick={() => handleClose(r._id)}>Close</button>}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r._id)} style={{ color: '#DC2626' }}><Trash2 size={13} /></button>
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

export default Maintenance;
