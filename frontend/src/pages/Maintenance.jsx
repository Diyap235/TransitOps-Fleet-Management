import React, { useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { maintenanceRecords as dummyRecords } from '../data/dummyData';
import { createMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } from '../api/maintenance.api';
import { Modal, FormField, Input, Select, ErrorBanner, ModalFooter, EmptyState, PageHeader, SearchBar } from '../components/UI';

const PRIORITY_BADGE = { High:'badge-red', Medium:'badge-orange', Low:'badge-green' };
const STATUS_BADGE   = { 'In Progress':'badge-blue', Scheduled:'badge-gray', Overdue:'badge-red', Completed:'badge-green', Active:'badge-orange', Closed:'badge-green' };
const EMPTY = { vehicle:'', description:'', cost:'', date:'', status:'Active' };

const MaintModal = ({ title, onClose, onSubmit, form, setForm, loading, error, isEdit }) => (
  <Modal title={title} onClose={onClose} maxWidth={500}>
    <form onSubmit={onSubmit}>
      <ErrorBanner message={error} />
      <FormField label="Vehicle Reg. No." required>
        <Input placeholder="MH12AB1234" value={form.vehicle}
          onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} required />
      </FormField>
      <FormField label="Issue / Description" required>
        <Input placeholder="e.g. Engine oil change and filter replacement"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
      </FormField>
      <div className="form-grid form-grid-2">
        <FormField label="Cost (₹)" required>
          <Input type="number" placeholder="5000" min="0" value={form.cost}
            onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} required />
        </FormField>
        <FormField label="Due Date">
          <Input type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </FormField>
        {isEdit && (
          <FormField label="Status">
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option>Active</option>
              <option>Closed</option>
            </Select>
          </FormField>
        )}
      </div>
      <ModalFooter onClose={onClose} loading={loading} saveLabel="Save Record" />
    </form>
  </Modal>
);

const Maintenance = () => {
  const [records, setRecords]     = useState(dummyRecords.map(r => ({ ...r, _id:r.id, description:r.issue, cost:0 })));
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = r => {
    setEditing(r._id);
    setForm({ vehicle:r.vehicle, description:r.description||r.issue, cost:r.cost||'', date:r.dueDate||'', status:r.status==='Completed'?'Closed':'Active' });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateMaintenanceRecord(editing, { ...form, description:form.description });
        setRecords(rs => rs.map(r => r._id===editing ? { ...r, ...form, issue:form.description } : r));
      } else {
        const n = { ...form, _id:`M-${Date.now()}`, id:`M-${Date.now()}`, issue:form.description, priority:'Medium', status:'Scheduled', dueDate:form.date };
        try { const res = await createMaintenanceRecord(form); setRecords(rs => [{ ...res.data, _id:res.data._id }, ...rs]); }
        catch { setRecords(rs => [n, ...rs]); }
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleClose = id => {
    setRecords(rs => rs.map(r => r._id===id ? { ...r, status:'Completed' } : r));
    updateMaintenanceRecord(id, { status:'Closed' }).catch(() => {});
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this record?')) return;
    setRecords(rs => rs.filter(r => r._id!==id));
    deleteMaintenanceRecord(id).catch(() => {});
  };

  const filtered = records.filter(r =>
    r.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
    (r.issue||r.description)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && (
        <MaintModal title={editing ? 'Edit Record' : 'Log Maintenance'}
          onClose={() => setModalOpen(false)} onSubmit={handleSubmit}
          form={form} setForm={setForm} loading={saving} error={error} isEdit={!!editing} />
      )}

      <PageHeader title="Maintenance"
        subtitle={`${records.filter(r=>r.status!=='Completed'&&r.status!=='Closed').length} open records across your fleet`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={15}/>Log Maintenance</button>} />

      {/* MAINTENANCE TIMELINE STRIP */}
      {records.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Calendar size={14} strokeWidth={2} style={{ color: 'var(--dc-text-faint)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Maintenance Timeline</span>
            </div>
            <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 4 }}>
              {records.map((r, idx) => {
                const today = new Date();
                const dueDate = new Date(r.dueDate || r.date);
                const daysUntil = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntil < 0;
                const isUpcoming = daysUntil >= 0 && daysUntil <= 7;
                
                let bgColor = '#10B981'; // green - future
                let tooltip = `Due in ${daysUntil} days`;
                if (isOverdue) {
                  bgColor = '#EF4444'; // red - overdue
                  tooltip = `Overdue by ${Math.abs(daysUntil)} days`;
                } else if (isUpcoming) {
                  bgColor = '#F59E0B'; // amber - upcoming (7 days)
                  tooltip = `Due in ${daysUntil} days`;
                }
                
                return (
                  <div
                    key={r._id}
                    title={`${r.vehicle} - ${r.issue} - ${tooltip}`}
                    style={{
                      width: 12,
                      height: 32,
                      borderRadius: 6,
                      background: bgColor,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      opacity: 0.8,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.height = '40px';
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${bgColor}40`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.height = '32px';
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#10B981' }} />
                <span style={{ color: 'var(--dc-text-faint)' }}>Upcoming</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E0B' }} />
                <span style={{ color: 'var(--dc-text-faint)' }}>Due Soon (7d)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#EF4444' }} />
                <span style={{ color: 'var(--dc-text-faint)' }}>Overdue</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Records <span style={{ color:'var(--dc-text-faint)', fontWeight:400 }}>({filtered.length})</span></span>
          <SearchBar value={search} onChange={setSearch} placeholder="Vehicle or issue…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Vehicle</th><th>Issue</th><th>Cost</th><th>Priority</th><th>Due Date</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <EmptyState icon={Wrench} title="No maintenance records"
                    description="Log vehicle maintenance to track service history and costs."
                    action={<button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Log Maintenance</button>} />
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--dc-text-faint)' }}>{r.id||r._id}</td>
                  <td><span className="td-primary">{r.vehicle}</span></td>
                  <td style={{ fontSize:12, color:'var(--dc-text-dim)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.issue||r.description}</td>
                  <td style={{ fontSize:12, color:'var(--dc-text-dim)', fontFamily:'monospace' }}>₹{Number(r.cost||0).toLocaleString()}</td>
                  <td>{r.priority && <span className={`badge ${PRIORITY_BADGE[r.priority]??'badge-gray'}`}>{r.priority}</span>}</td>
                  <td>
                    {(r.dueDate||r.date) && (
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--dc-text-faint)', fontFamily:'monospace' }}>
                        <Calendar size={12}/>{r.dueDate||r.date}
                      </span>
                    )}
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[r.status]??'badge-gray'}`}>{r.status}</span></td>
                  <td>
                    <div className="row-actions" style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                      {r.status!=='Completed'&&r.status!=='Closed' && (
                        <button className="btn btn-ghost btn-sm hoverable" style={{ color:'var(--dc-teal)' }} onClick={() => handleClose(r._id)}>Close</button>
                      )}
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => openEdit(r)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => handleDelete(r._id)} style={{ color:'var(--dc-red)' }}><Trash2 size={13}/></button>
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
