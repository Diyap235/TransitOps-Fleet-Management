import React, { useState } from 'react';
import { UserRound, Plus, Pencil, Trash2 } from 'lucide-react';
import { drivers as dummyDrivers } from '../data/dummyData';
import { createDriver, updateDriver, deleteDriver } from '../api/drivers.api';
import { Modal, FormField, Input, Select, ErrorBanner, ModalFooter, EmptyState, PageHeader, SearchBar } from '../components/UI';

const STATUS_BADGE = { Available:'badge-green', 'On Trip':'badge-blue', 'Off Duty':'badge-gray', Suspended:'badge-red' };
const EMPTY = { name:'', licenseNumber:'', licenseCategory:'', licenseExpiryDate:'', contactNumber:'', safetyScore:100, status:'Available' };

const Stars = ({ rating }) => {
  const r = Number(rating) || 0;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(r) ? '#F5A623' : 'var(--dc-line)', fontSize:13 }}>★</span>
      ))}
      <span style={{ fontSize:11, color:'var(--dc-text-faint)', marginLeft:4, fontFamily:'monospace' }}>{r.toFixed(1)}</span>
    </span>
  );
};

const DriverModal = ({ title, onClose, onSubmit, form, setForm, loading, error }) => (
  <Modal title={title} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <ErrorBanner message={error} />
      <FormField label="Full Name" required>
        <Input placeholder="e.g. Rajesh Kumar" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </FormField>
      <div className="form-grid form-grid-2">
        <FormField label="License Number" required>
          <Input placeholder="MH0120150012345" value={form.licenseNumber}
            onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} required />
        </FormField>
        <FormField label="License Category" required>
          <Input placeholder="HMV" value={form.licenseCategory}
            onChange={e => setForm(f => ({ ...f, licenseCategory: e.target.value }))} required />
        </FormField>
        <FormField label="Contact Number" required>
          <Input placeholder="+91 9876543210" value={form.contactNumber}
            onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} required />
        </FormField>
        <FormField label="Safety Score">
          <Input type="number" placeholder="100" min="0" max="100" value={form.safetyScore}
            onChange={e => setForm(f => ({ ...f, safetyScore: e.target.value }))} />
        </FormField>
        <FormField label="License Expiry" required>
          <Input type="date" value={form.licenseExpiryDate}
            onChange={e => setForm(f => ({ ...f, licenseExpiryDate: e.target.value }))} required />
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Available','On Trip','Off Duty','Suspended'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
      </div>
      <ModalFooter onClose={onClose} loading={loading} saveLabel="Save Driver" />
    </form>
  </Modal>
);

const Drivers = () => {
  const [drivers, setDrivers]     = useState(dummyDrivers.map(d => ({ ...d, _id: d.id })));
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = d => {
    setEditing(d._id);
    setForm({ name:d.name, licenseNumber:d.licenseNumber, licenseCategory:d.licenseCategory||'',
      licenseExpiryDate:'', contactNumber:d.phone||d.contactNumber||'',
      safetyScore:d.safetyScore||100, status:d.status });
    setError(''); setModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) {
        await updateDriver(editing, form);
        setDrivers(ds => ds.map(d => d._id === editing ? { ...d, ...form } : d));
      } else {
        const res = await createDriver(form);
        setDrivers(ds => [{ ...res.data, _id:res.data._id }, ...ds]);
      }
      setModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save driver.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
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
      {modalOpen && (
        <DriverModal title={editing ? 'Edit Driver' : 'Add Driver'}
          onClose={() => setModalOpen(false)} onSubmit={handleSubmit}
          form={form} setForm={setForm} loading={saving} error={error} />
      )}

      <PageHeader title="Drivers" subtitle={`${drivers.length} drivers registered across your fleet`}
        action={<button className="btn btn-primary" onClick={openAdd}><Plus size={15} strokeWidth={2.5}/>Add Driver</button>} />

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Drivers <span style={{ color:'var(--dc-text-faint)', fontWeight:400 }}>({filtered.length})</span></span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or license…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>License No.</th><th>Category</th><th>Expiry Date</th><th>Contact</th><th>Experience</th><th>Rating</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState icon={UserRound} title="No drivers found"
                    description="Register your drivers to assign them to trips."
                    action={<button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Add Driver</button>} />
                </td></tr>
              ) : filtered.map(d => (
                <tr key={d._id}>
                  <td><span className="td-primary">{d.name}</span></td>
                  <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--dc-text-dim)' }}>{d.licenseNumber}</td>
                  <td style={{ fontSize:12, color:'var(--dc-text-dim)' }}>{d.licenseCategory||'—'}</td>
                  <td style={{ fontSize:11, color:'var(--dc-text-faint)', fontFamily:'monospace' }}>{d.licenseExpiryDate ? new Date(d.licenseExpiryDate).toLocaleDateString() : '—'}</td>
                  <td style={{ fontSize:12, color:'var(--dc-text-faint)' }}>{d.phone||d.contactNumber||'—'}</td>
                  <td style={{ fontSize:12 }}>{d.experience ? `${d.experience} yrs` : '—'}</td>
                  <td><Stars rating={d.rating||(d.safetyScore/20)||4} /></td>
                  <td><span className={`badge ${STATUS_BADGE[d.status]??'badge-gray'}`}>{d.status}</span></td>
                  <td>
                    <div className="row-actions" style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => openEdit(d)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost btn-sm hoverable" onClick={() => handleDelete(d._id)} style={{ color:'var(--dc-red)' }}><Trash2 size={13}/></button>
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
