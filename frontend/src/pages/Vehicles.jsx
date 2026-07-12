import React, { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search, X, AlertCircle, Grid3x3, List } from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'In Shop':   'badge-orange',
  'Retired':   'badge-gray',
};

const EMPTY_FORM = { registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' };

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => {
  // Vehicle type capacity limits
  const CAPACITY_LIMITS = {
    'Auto Rickshaw': 500,
    'Sedan': 200,
    'MPV': 2000,
    'SUV': 2500,
    'Pickup': 3000,
    'Tempo': 5000,
    'Light Truck': 5000,
    'Medium Truck': 10000,
    'Heavy Truck': 25000,
    'Trailer': 50000,
  };

  const checkCapacityWarning = () => {
    const capacity = Number(form.maxLoadCapacity);
    const typeKey = Object.keys(CAPACITY_LIMITS).find(k => 
      form.type?.toLowerCase().includes(k.toLowerCase()) || 
      k.toLowerCase().includes(form.type?.toLowerCase())
    );
    
    if (typeKey && capacity > CAPACITY_LIMITS[typeKey]) {
      return `Warning: ${capacity}kg exceeds typical capacity for ${form.type} (limit: ${CAPACITY_LIMITS[typeKey]}kg)`;
    }
    if (capacity > 100000) {
      return 'Warning: Max load capacity seems unusually high (>100,000kg)';
    }
    return null;
  };

  const capacityWarning = checkCapacityWarning();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ 
        background: 'rgba(30, 36, 51, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 14, 
        width: '100%', 
        maxWidth: 520, 
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        border: '1px solid rgba(76, 141, 255, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(45, 53, 72, 0.6)' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#E2E8F0' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B95A7' }}><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} style={{ padding: 24 }}>
          {error && <div className="alert alert-error"><AlertCircle size={14} />{error}</div>}
          {capacityWarning && <div className="alert alert-info"><AlertCircle size={14} />{capacityWarning}</div>}
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
                <label className="form-label" style={{ color: '#C4CEDC' }}>{label}</label>
                <input 
                  className="form-control" 
                  style={{
                    background: 'rgba(26, 31, 46, 0.8)',
                    borderColor: 'rgba(45, 53, 72, 0.6)',
                    color: '#E2E8F0',
                  }}
                  type={type || 'text'} 
                  placeholder={placeholder}
                  value={form[key]} 
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} 
                  required 
                />
              </div>
            ))}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#C4CEDC' }}>Status</label>
              <select 
                className="form-control"
                style={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  borderColor: 'rgba(45, 53, 72, 0.6)',
                  color: '#E2E8F0',
                }}
                value={form.status} 
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
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
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

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
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button 
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
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
        {viewMode === 'table' ? (
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
        ) : (
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Truck size={22} strokeWidth={1.5} /></div>
                <h3>No vehicles found</h3>
                <p>Add your first vehicle to start managing your fleet.</p>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Vehicle</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {filtered.map(v => (
                  <div key={v._id} style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    cursor: 'pointer',
                    ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(37,99,235,0.12)' }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(37,99,235,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{v.registrationNumber}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{v.name}</div>
                      </div>
                      <span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>{v.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Type</div>
                        <div style={{ marginTop: 3, color: 'var(--text)' }}>{v.type}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Load Capacity</div>
                        <div style={{ marginTop: 3, color: 'var(--text)' }}>{Number(v.maxLoadCapacity).toLocaleString()} kg</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Odometer</div>
                        <div style={{ marginTop: 3, color: 'var(--text)' }}>{Number(v.odometer).toLocaleString()} km</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(226,232,240,0.4)' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)} style={{ flex: 1 }}>
                        <Pencil size={13} />Edit
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v._id)} style={{ flex: 1, color: 'var(--danger)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Vehicles;
