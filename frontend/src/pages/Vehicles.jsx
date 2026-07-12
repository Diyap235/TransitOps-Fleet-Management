import React, { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Search } from 'lucide-react';
// import { getVehicles } from '../api/vehicles.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'In Shop':   'badge-orange',
  'Retired':   'badge-gray',
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: getVehicles().then(res => setVehicles(res.data));
  }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Vehicles</h1>
          <p>Manage your fleet vehicles and track their status.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          Add Vehicle
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Vehicles ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Name</th>
                <th>Type</th>
                <th>Max Load (kg)</th>
                <th>Odometer (km)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Truck size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No vehicles found</h3>
                      <p>Add your first vehicle to start managing your fleet.</p>
                      <button className="btn btn-primary">
                        <Plus size={14} strokeWidth={2.5} /> Add Vehicle
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v._id}>
                    <td className="td-primary">{v.registrationNumber}</td>
                    <td>{v.name}</td>
                    <td>{v.type}</td>
                    <td>{v.maxLoadCapacity?.toLocaleString()}</td>
                    <td>{v.odometer?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm">
                          <Pencil size={13} strokeWidth={2} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Vehicles;
