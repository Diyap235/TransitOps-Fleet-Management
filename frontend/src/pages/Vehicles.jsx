<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search, X, AlertCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
=======
import React, { useState } from 'react';
import { Truck, Plus, Pencil, Trash2 } from 'lucide-react';
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
import { vehicles as dummyVehicles } from '../data/dummyData';
import { createVehicle, updateVehicle, deleteVehicle } from '../api/vehicles.api';
import {
  Modal, FormField, Input, Select, ErrorBanner,
  ModalFooter, EmptyState, PageHeader, SearchBar, FuelBar,
} from '../components/UI';

const STATUS_BADGE = {
  'Available':   'badge-green',
  'On Trip':     'badge-blue',
  'Maintenance': 'badge-orange',
  'In Shop':     'badge-orange',
  'Retired':     'badge-gray',
};
const EMPTY = { registrationNumber:'', name:'', type:'', maxLoadCapacity:'', odometer:'', acquisitionCost:'', status:'Available' };

<<<<<<< HEAD
const EMPTY_FORM = {
  registrationNumber: '', name: '', type: '',
  maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available',
};

// ── useSortState: manages column + direction cycling ─────────────
const useSortState = (defaultCol) => {
  const [sort, setSort] = useState({ col: defaultCol, dir: 'asc' });
  const toggle = (col) =>
    setSort(s =>
      s.col === col
        ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' }
    );
  return [sort, toggle];
};

// ── SortTh: clickable header cell ────────────────────────────────
const SortTh = ({ col, label, sort, onSort, style }) => {
  const active = sort.col === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        color: active ? 'var(--primary)' : undefined, ...style,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        {active
          ? (sort.dir === 'asc'
              ? <ChevronUp   size={12} strokeWidth={2.5} />
              : <ChevronDown size={12} strokeWidth={2.5} />)
          : <ChevronsUpDown size={12} strokeWidth={2} style={{ opacity: 0.3 }} />}
      </span>
    </th>
  );
};

// ── sort helper ───────────────────────────────────────────────────
const numericCols = new Set(['odometer', 'fuelLevel', 'maxLoadCapacity', 'acquisitionCost']);
const applySortV = (arr, { col, dir }) => {
  const d = dir === 'asc' ? 1 : -1;
  return [...arr].sort((a, b) => {
    const av = a[col] ?? '';
    const bv = b[col] ?? '';
    if (numericCols.has(col)) return d * (Number(av) - Number(bv));
    return d * String(av).localeCompare(String(bv));
  });
};

// ── Modal ─────────────────────────────────────────────────────────
const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
    <div style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} style={{ padding: 24 }}>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}><AlertCircle size={14} style={{ flexShrink: 0 }} />{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'registrationNumber', label: 'Registration Number',  placeholder: 'e.g. MH12AB1234' },
            { key: 'name',               label: 'Vehicle Model',         placeholder: 'e.g. Tata Prima 4928' },
            { key: 'type',               label: 'Type',                  placeholder: 'e.g. Heavy Truck' },
            { key: 'maxLoadCapacity',    label: 'Max Load (kg)',          placeholder: '10000', type: 'number' },
            { key: 'odometer',           label: 'Odometer (km)',          placeholder: '0',     type: 'number' },
            { key: 'acquisitionCost',    label: 'Acquisition Cost (₹)',  placeholder: '500000',type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--gray-700)' }}>{label}</label>
              <input style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
                type={type || 'text'} placeholder={placeholder} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--gray-700)' }}>Status</label>
            <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface)', color: 'var(--text)' }}
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Available', 'On Trip', 'In Shop', 'Retired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading && <span className="spinner" />}
            {loading ? 'Saving…' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  </div>
=======
const VehicleModal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <Modal title={title} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <ErrorBanner message={error} />
      <div className="form-grid form-grid-2">
        {[
          { key:'registrationNumber', label:'Registration No.', placeholder:'MH12AB1234' },
          { key:'name',               label:'Vehicle Model',    placeholder:'Tata Prima 4928' },
          { key:'type',               label:'Type',             placeholder:'Heavy Truck' },
          { key:'maxLoadCapacity',    label:'Max Load (kg)',    placeholder:'10000', type:'number' },
          { key:'odometer',           label:'Odometer (km)',    placeholder:'0',     type:'number' },
          { key:'acquisitionCost',    label:'Acquisition Cost (₹)', placeholder:'500000', type:'number' },
        ].map(({ key, label, placeholder, type }) => (
          <FormField key={key} label={label} required>
            <Input type={type||'text'} placeholder={placeholder} value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
          </FormField>
        ))}
        <FormField label="Status">
          <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Available','On Trip','In Shop','Retired'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
      </div>
      <ModalFooter onClose={onClose} loading={loading} saveLabel="Save Vehicle" />
    </form>
  </Modal>
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
);

// ── Page ──────────────────────────────────────────────────────────
const Vehicles = () => {
  const [vehicles, setVehicles] = useState(
    dummyVehicles.map(v => ({ ...v, _id: v.id, name: v.model, type: v.model.split(' ')[0], maxLoadCapacity: 10000, acquisitionCost: 0 }))
  );
  const [search,    setSearch]    = useState('');
  const [modalOpen, setModalOpen] = useState(false);
<<<<<<< HEAD
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [sort,      toggleSort]   = useSortState('registrationNumber');
=======
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = v => {
    setEditing(v._id);
    setForm({ registrationNumber: v.registrationNumber, name: v.name, type: v.type,
      maxLoadCapacity: v.maxLoadCapacity, odometer: v.odometer,
      acquisitionCost: v.acquisitionCost, status: v.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async e => {
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

  const handleDelete = async id => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteVehicle(id); setVehicles(vs => vs.filter(v => v._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const displayed = useMemo(() => {
    const searched = vehicles.filter(v =>
      v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.driver?.toLowerCase().includes(search.toLowerCase())
    );
    return applySortV(searched, sort);
  }, [vehicles, search, sort]);

  const thProps = { sort, onSort: toggleSort };

  return (
    <>
      {modalOpen && (
        <VehicleModal title={editing ? 'Edit Vehicle' : 'Add Vehicle'}
          onClose={() => setModalOpen(false)} onSubmit={handleSubmit}
          form={form} setForm={setForm} loading={saving} error={error} />
      )}

      <PageHeader title="Vehicles" subtitle={`Managing a fleet of ${vehicles.length} vehicles`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={15} strokeWidth={2.5}/>Add Vehicle</button>} />

      <div className="card">
        <div className="card-header">
<<<<<<< HEAD
          <span className="card-title">All Vehicles ({displayed.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input type="text" placeholder="Search by reg, model, driver…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
=======
          <span className="card-title">All Vehicles <span style={{ color:'var(--dc-text-faint)', fontWeight:400 }}>({filtered.length})</span></span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search reg, model, driver…" />
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
<<<<<<< HEAD
                <SortTh col="registrationNumber" label="Reg. Number"    {...thProps} />
                <SortTh col="name"               label="Model"          {...thProps} />
                <SortTh col="driver"             label="Driver"         {...thProps} />
                <SortTh col="location"           label="Location"       {...thProps} />
                <SortTh col="odometer"           label="Odometer (km)"  {...thProps} />
                <SortTh col="fuelLevel"          label="Fuel"           {...thProps} />
                <SortTh col="status"             label="Status"         {...thProps} />
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Truck size={22} strokeWidth={1.5} /></div>
                    <h3>No vehicles found</h3>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Vehicle</button>
                  </div>
                </td></tr>
              ) : displayed.map(v => (
                <tr key={v._id || v.id}>
                  <td className="td-primary">{v.registrationNumber}</td>
                  <td>{v.model || v.name}</td>
                  <td style={{ color: 'var(--gray-600)' }}>{v.driver || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{v.location || '—'}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{Number(v.odometer).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--gray-200)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${v.fuelLevel}%`, height: '100%', background: v.fuelLevel > 50 ? '#16A34A' : v.fuelLevel > 20 ? '#D97706' : '#DC2626', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{v.fuelLevel}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>{v.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)} title="Edit"><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v._id || v.id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
=======
                <th>Reg. Number</th><th>Model</th><th>Max Load (kg)</th><th>Acquisition Cost</th><th>Driver</th>
                <th>Location</th><th>Odometer</th><th>Fuel</th>
                <th>Status</th><th style={{ textAlign:'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <EmptyState icon={Truck} title="No vehicles found"
                    description="Add your first vehicle to start managing your fleet."
                    action={<button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Add Vehicle</button>} />
                </td></tr>
              ) : filtered.map(v => (
                <tr key={v._id||v.id}>
                  <td><span className="td-primary">{v.registrationNumber}</span></td>
                  <td style={{ color:'var(--dc-text)', fontWeight:500 }}>{v.model||v.name}</td>
                  <td style={{ fontSize:12, fontFamily:'monospace' }}>{Number(v.maxLoadCapacity||10000).toLocaleString()}</td>
                  <td style={{ fontSize:12, color:'var(--dc-text-dim)' }}>₹{Number(v.acquisitionCost||0).toLocaleString()}</td>
                  <td style={{ color:'var(--dc-text-dim)', fontSize:12 }}>{v.status === 'On Trip' ? (v.driver||'—') : '—'}</td>
                  <td style={{ color:'var(--dc-text-faint)', fontSize:12 }}>{v.location||'—'}</td>
                  <td style={{ fontFamily:'monospace', fontSize:12 }}>{Number(v.odometer).toLocaleString()} km</td>
                  <td><FuelBar level={v.fuelLevel} /></td>
                  <td><span className={`badge ${STATUS_BADGE[v.status]??'badge-gray'}`}>{v.status}</span></td>
                  <td>
                    <div className="row-actions" style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => openEdit({ ...v, _id:v.id })} title="Edit"><Pencil size={13}/></button>
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => handleDelete(v._id||v.id)} title="Delete" style={{ color:'var(--dc-red)' }}><Trash2 size={13}/></button>
>>>>>>> 71abe949efd3319da0dae0163e858d09e8d7023b
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
