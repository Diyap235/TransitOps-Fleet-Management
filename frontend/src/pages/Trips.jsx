import React, { useState } from 'react';
import { Route, Plus, Pencil, Trash2, LayoutGrid, List, User, Truck, MapPin } from 'lucide-react';
import { trips as dummyTrips } from '../data/dummyData';
import { createTrip, updateTrip, deleteTrip } from '../api/trips.api';
import { Modal, FormField, Input, ErrorBanner, ModalFooter, EmptyState, PageHeader, SearchBar } from '../components/UI';

const STATUS_BADGE = { Draft:'badge-gray', Dispatched:'badge-blue', Completed:'badge-green', Cancelled:'badge-red' };
const EMPTY = { source:'', destination:'', vehicle:'', driver:'', cargoWeight:'', plannedDistance:'' };

const TripModal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <Modal title={title} onClose={onClose} maxWidth={540}>
    <form onSubmit={onSubmit}>
      <ErrorBanner message={error} />
      <div className="form-grid form-grid-2">
        {[
          { key:'source',          label:'Source',           placeholder:'e.g. Mumbai' },
          { key:'destination',     label:'Destination',      placeholder:'e.g. Pune' },
          { key:'vehicle',         label:'Vehicle Reg. No.', placeholder:'MH12AB1234' },
          { key:'driver',          label:'Driver Name',      placeholder:'Rajesh Kumar' },
          { key:'cargoWeight',     label:'Cargo (kg)',       placeholder:'0',   type:'number', req:false },
          { key:'plannedDistance', label:'Distance (km)',    placeholder:'100', type:'number' },
        ].map(({ key, label, placeholder, type, req=true }) => (
          <FormField key={key} label={label} required={req}>
            <Input type={type||'text'} placeholder={placeholder} value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required={req} />
          </FormField>
        ))}
      </div>
      <ModalFooter onClose={onClose} loading={loading} saveLabel="Save Trip" />
    </form>
  </Modal>
);

const STATUS_FILTERS = ['All','Dispatched','Draft','Completed','Cancelled'];

const Trips = () => {
  const [trips, setTrips]         = useState(dummyTrips.map(t => ({ ...t, _id: t.tripId })));
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [viewMode, setViewMode]   = useState('table'); // 'table' or 'kanban'

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = t => {
    setEditing(t._id);
    setForm({ source:t.source, destination:t.destination, vehicle:t.vehicle||'', driver:t.driver||'', cargoWeight:'', plannedDistance:t.distance||'' });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateTrip(editing, form);
        setTrips(ts => ts.map(t => t._id === editing ? { ...t, ...form } : t));
      } else {
        const newTrip = { ...form, _id:`T-${Date.now()}`, tripId:`T-${Date.now()}`, status:'Draft', startDate:new Date().toISOString().split('T')[0] };
        try { const res = await createTrip(form); setTrips(ts => [{ ...res.data, _id:res.data._id }, ...ts]); }
        catch { setTrips(ts => [newTrip, ...ts]); }
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save trip.'); }
    finally { setSaving(false); }
  };

  const changeStatus = (id, s) => {
    setTrips(ts => ts.map(t => t._id === id ? { ...t, status:s } : t));
    updateTrip(id, { status:s }).catch(() => {});
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this trip?')) return;
    setTrips(ts => ts.filter(t => t._id !== id));
    deleteTrip(id).catch(() => {});
  };

  const filtered = trips.filter(t =>
    (activeTab === 'All' || t.status === activeTab) &&
    [t.source, t.destination, t.driver, t.vehicle].some(v =>
      v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {modalOpen && (
        <TripModal title={editing ? 'Edit Trip' : 'New Trip'}
          onClose={() => setModalOpen(false)} onSubmit={handleSubmit}
          form={form} setForm={setForm} loading={saving} error={error} />
      )}

      <PageHeader title="Trips"
        subtitle={`${trips.length} trips total · ${trips.filter(t=>t.status==='Dispatched').length} active`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={15}/>New Trip</button>} />

      <div className="tab-bar">
        {STATUS_FILTERS.map(s => {
          const count = s === 'All' ? trips.length : trips.filter(t => t.status === s).length;
          return (
            <button key={s} className={`tab-btn${activeTab===s?' active':''}`} onClick={() => setActiveTab(s)}>
              {s}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Trips <span style={{ color:'var(--dc-text-faint)', fontWeight:400 }}>({filtered.length})</span></span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Route, driver, vehicle…" />
            <div style={{ display: 'flex', background: 'var(--dc-panel)', border: '1px solid var(--dc-line)', borderRadius: 8, padding: 4 }}>
              <button onClick={() => setViewMode('table')} title="Table view"
                style={{ padding: '6px 10px', background: viewMode === 'table' ? 'rgba(37, 99, 235, 0.15)' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: viewMode === 'table' ? 'var(--dc-blue)' : 'var(--dc-text-dim)', transition: 'all 0.2s' }}>
                <List size={16} strokeWidth={2} />
              </button>
              <button onClick={() => setViewMode('kanban')} title="Kanban view"
                style={{ padding: '6px 10px', background: viewMode === 'kanban' ? 'rgba(37, 99, 235, 0.15)' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: viewMode === 'kanban' ? 'var(--dc-blue)' : 'var(--dc-text-dim)', transition: 'all 0.2s' }}>
                <LayoutGrid size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Trip ID</th><th>Route</th><th>Driver</th><th>Vehicle</th><th>Distance</th><th>Date</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}>
                    <EmptyState icon={Route} title="No trips found"
                      description="Create your first trip to start dispatching vehicles and drivers."
                      action={<button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>New Trip</button>} />
                  </td></tr>
                ) : filtered.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--dc-text-faint)' }}>{t.tripId||t._id}</td>
                    <td><span className="td-primary">{t.source}</span><span style={{ color:'var(--dc-text-faint)', margin:'0 5px' }}>→</span><span className="td-primary">{t.destination}</span></td>
                    <td style={{ color:'var(--dc-text-dim)', fontSize:12 }}>{t.driver}</td>
                    <td style={{ color:'var(--dc-text-faint)', fontSize:11, fontFamily:'monospace' }}>{t.vehicle}</td>
                    <td style={{ fontSize:12 }}>{t.distance||t.plannedDistance} km</td>
                    <td style={{ fontSize:11, color:'var(--dc-text-faint)', fontFamily:'monospace' }}>{t.startDate}</td>
                    <td><span className={`badge ${STATUS_BADGE[t.status]??'badge-gray'}`}>{t.status}</span></td>
                    <td>
                      <div className="row-actions" style={{ display:'flex', gap:4, justifyContent:'flex-end', flexWrap:'wrap' }}>
                        {t.status==='Draft'      && <button className="btn btn-ghost btn-sm hoverable" style={{ color:'var(--dc-blue)' }} onClick={() => changeStatus(t._id,'Dispatched')}>Dispatch</button>}
                        {t.status==='Dispatched' && <button className="btn btn-ghost btn-sm hoverable" style={{ color:'var(--dc-teal)' }} onClick={() => changeStatus(t._id,'Completed')}>Complete</button>}
                        {(t.status==='Draft'||t.status==='Dispatched') && <button className="btn btn-ghost btn-sm hoverable" style={{ color:'var(--dc-amber)' }} onClick={() => changeStatus(t._id,'Cancelled')}>Cancel</button>}
                        <button className="btn btn-ghost btn-sm hoverable" onClick={() => openEdit(t)}><Pencil size={13}/></button>
                        <button className="btn btn-ghost btn-sm hoverable" onClick={() => handleDelete(t._id)} style={{ color:'var(--dc-red)' }}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* KANBAN VIEW */}
        {viewMode === 'kanban' && (
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 16, overflowX: 'auto' }}>
              {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map(status => {
                const statusTrips = trips.filter(t => t.status === status);
                const statusColors = {
                  'Draft': { bg: 'rgba(107, 114, 128, 0.1)', border: '#6B7280', label: '#6B7280' },
                  'Dispatched': { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', label: '#3B82F6' },
                  'Completed': { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', label: '#10B981' },
                  'Cancelled': { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', label: '#EF4444' }
                };
                const colors = statusColors[status];
                
                return (
                  <div key={status} style={{
                    background: colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: 12,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Column Header */}
                    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.label }}>{status}</div>
                      <div style={{ fontSize: 12, color: 'var(--dc-text-faint)', marginTop: 4 }}>{statusTrips.length} trip{statusTrips.length !== 1 ? 's' : ''}</div>
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                      {statusTrips.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--dc-text-faint)', fontSize: 12, marginTop: 'auto', marginBottom: 'auto' }}>No trips</div>
                      ) : (
                        statusTrips.map(t => (
                          <div key={t._id} style={{
                            background: 'var(--dc-panel)',
                            border: '1px solid var(--dc-line)',
                            borderRadius: 8,
                            padding: 10,
                            cursor: 'grab',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--dc-text-faint)' }}>{t.tripId||t._id}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dc-text)', marginTop: 4 }}>{t.source} → {t.destination}</div>
                            <div style={{ fontSize: 11, color: 'var(--dc-text-dim)', marginTop: 6, lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} /> {t.driver}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} /> {t.vehicle}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} /> {t.distance||t.plannedDistance} km</div>
                            </div>
                            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                              {t.status==='Draft' && <button className="btn btn-ghost btn-xs" onClick={() => changeStatus(t._id,'Dispatched')} style={{ flex: 1, fontSize: 10 }}>Dispatch</button>}
                              {t.status==='Dispatched' && <button className="btn btn-ghost btn-xs" onClick={() => changeStatus(t._id,'Completed')} style={{ flex: 1, fontSize: 10 }}>Complete</button>}
                              {(t.status==='Draft'||t.status==='Dispatched') && <button className="btn btn-ghost btn-xs" onClick={() => changeStatus(t._id,'Cancelled')} style={{ flex: 1, fontSize: 10 }}>Cancel</button>}
                              <button className="btn btn-ghost btn-xs" onClick={() => handleDelete(t._id)} style={{ flex: 1, fontSize: 10, color: 'var(--dc-red)' }}>Delete</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Trips;
