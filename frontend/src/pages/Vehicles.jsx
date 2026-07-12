import React, { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'In Shop':   'badge-orange',
  'Retired':   'badge-gray',
};

const EMPTY_FORM = { registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' };

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
            { key: 'registrationNumber', label: 'Registration Number', placeholder: 'e.g. MH12AB1234' },
            { key: 'name', label: 'Vehicle Name', placeholder: 'e.g. Tata Prima 4928' },
            { key: 'type', label: 'Type', placeholder: 'e.g. Heavy Truck' },
            { key: 'maxLoadCapacity', label: 'Max Load Capacity (kg)', placeholder: '10000', type: 'number' },
            { key: 'odometer', label: 'Odometer (km)', placeholder: '0', type: 'number' },
            { key: 'acquisitionCost', label: 'Acquisition Cost', placeholder: '500000', type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div className="form-group" style={{ marginBottom: 0 }} key={key}>
              <label className="form-label">{label}</label>
              <input className="form-control" type={type || 'text'} placeholder={placeholder}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'In Shop', 'Retired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}{loading ? 'Saving…' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getVehicles().then(res => setVehicles(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (v) => {
    setEditing(v._id);
    setForm({ registrationNumber: v.registrationNumber, name: v.name, type: v.type, maxLoadCapacity: v.maxLoadCapacity, odometer: v.odometer, acquisitionCost: v.acquisitionCost, status: v.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) await updateVehicle(editing, form);
      else await createVehicle(form);
      setModalOpen(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteVehicle(id); load(); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = vehicles.filter(v =>
    v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    v.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modalOpen && <Modal title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} form={form} setForm={setForm} loading={saving} error={error} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Vehicles</h1>
          <p>Manage your fleet vehicles and track their status.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} strokeWidth={2.5} />Add Vehicle</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Vehicles ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Registration</th><th>Name</th><th>Type</th><th>Max Load (kg)</th><th>Odometer (km)</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Truck size={22} strokeWidth={1.5} /></div>
                    <h3>No vehicles found</h3>
                    <p>Add your first vehicle to start managing your fleet.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Vehicle</button>
                  </div>
                </td></tr>
              ) : filtered.map(v => (
                <tr key={v._id}>
                  <td className="td-primary">{v.registrationNumber}</td>
                  <td>{v.name}</td>
                  <td>{v.type}</td>
                  <td>{Number(v.maxLoadCapacity).toLocaleString()}</td>
                  <td>{Number(v.odometer).toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>{v.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)} title="Edit"><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v._id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
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
