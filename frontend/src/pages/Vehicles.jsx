import React, { useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { vehicles as dummyVehicles } from '../data/dummyData';
import { createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles.api';

const STATUS_BADGE = {
  'Available':   'badge-green',
  'On Trip':     'badge-blue',
  'Maintenance': 'badge-orange',
  'In Shop':     'badge-orange',
  'Retired':     'badge-gray',
};

const EMPTY_FORM = { registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'registrationNumber', label: 'Registration Number', placeholder: 'e.g. MH12AB1234' },
            { key: 'name',               label: 'Vehicle Model',        placeholder: 'e.g. Tata Prima 4928' },
            { key: 'type',               label: 'Type',                 placeholder: 'e.g. Heavy Truck' },
            { key: 'maxLoadCapacity',    label: 'Max Load (kg)',         placeholder: '10000', type: 'number' },
            { key: 'odometer',           label: 'Odometer (km)',         placeholder: '0',     type: 'number' },
            { key: 'acquisitionCost',    label: 'Acquisition Cost (₹)', placeholder: '500000', type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>{label}</label>
              <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none' }}
                type={type || 'text'} placeholder={placeholder} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Status</label>
            <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'In Shop', 'Retired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 7, background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            {loading && <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
            {loading ? 'Saving…' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(
    dummyVehicles.map(v => ({ ...v, _id: v.id, name: v.model, type: v.model.split(' ')[0], maxLoadCapacity: 10000, acquisitionCost: 0 }))
  );
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (v) => {
    setEditing(v._id);
    setForm({ registrationNumber: v.registrationNumber, name: v.name, type: v.type, maxLoadCapacity: v.maxLoadCapacity, odometer: v.odometer, acquisitionCost: v.acquisitionCost, status: v.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing, form);
        setVehicles(vs => vs.map(v => v._id === editing ? { ...v, ...form } : v));
      } else {
        const res = await createVehicle(form);
        setVehicles(vs => [{ ...res.data, _id: res.data._id }, ...vs]);
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save vehicle.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteVehicle(id); setVehicles(vs => vs.filter(v => v._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = vehicles.filter(v =>
    v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.driver?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Vehicles</h1>
          <p>Manage your fleet of {vehicles.length} vehicles.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} strokeWidth={2.5} />Add Vehicle</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Vehicles ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search by reg, model, driver…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reg. Number</th>
                <th>Model</th>
                <th>Assigned Driver</th>
                <th>Location</th>
                <th>Odometer (km)</th>
                <th>Fuel Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Truck size={22} strokeWidth={1.5} /></div>
                    <h3>No vehicles found</h3>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Vehicle</button>
                  </div>
                </td></tr>
              ) : filtered.map(v => (
                <tr key={v._id || v.id}>
                  <td className="td-primary">{v.registrationNumber}</td>
                  <td>{v.model || v.name}</td>
                  <td style={{ color: '#4B5563' }}>{v.driver || '—'}</td>
                  <td style={{ color: '#6B7280', fontSize: 12 }}>{v.location || '—'}</td>
                  <td>{Number(v.odometer).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${v.fuelLevel}%`, height: '100%', background: v.fuelLevel > 50 ? '#16A34A' : v.fuelLevel > 20 ? '#D97706' : '#DC2626', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>{v.fuelLevel}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>{v.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit({ ...v, _id: v.id })} title="Edit"><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v._id || v.id)} title="Delete" style={{ color: '#DC2626' }}><Trash2 size={13} /></button>
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

export default Vehicles;
