import React, { useState } from 'react';
import { Truck, Plus, Pencil, Trash2 } from 'lucide-react';
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
);

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(
    dummyVehicles.map(v => ({ ...v, _id: v.id, name: v.model, type: v.model.split(' ')[0], maxLoadCapacity: 10000, acquisitionCost: 0 }))
  );
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

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

  const filtered = vehicles.filter(v =>
    v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.driver?.toLowerCase().includes(search.toLowerCase())
  );

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
          <span className="card-title">All Vehicles <span style={{ color:'var(--dc-text-faint)', fontWeight:400 }}>({filtered.length})</span></span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search reg, model, driver…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
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
