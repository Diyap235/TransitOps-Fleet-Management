import React, { useEffect, useState } from 'react';
import { UserRound, Plus, Pencil, Trash2, Search } from 'lucide-react';
// import { getDrivers } from '../api/drivers.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'Off Duty':  'badge-gray',
  'Suspended': 'badge-red',
};

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: getDrivers().then(res => setDrivers(res.data));
  }, []);

  const filtered = drivers.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Drivers</h1>
          <p>Manage drivers, licenses, and safety scores.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          Add Driver
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Drivers ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <UserRound size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No drivers found</h3>
                      <p>Register your drivers to assign them to trips.</p>
                      <button className="btn btn-primary">
                        <Plus size={14} strokeWidth={2.5} /> Add Driver
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const score = d.safetyScore ?? 0;
                  const scoreColor =
                    score >= 80 ? 'var(--success)' :
                    score >= 60 ? 'var(--warning)' : 'var(--danger)';
                  return (
                    <tr key={d._id}>
                      <td className="td-primary">{d.name}</td>
                      <td>{d.licenseNumber}</td>
                      <td>{d.licenseCategory}</td>
                      <td>{new Date(d.licenseExpiryDate).toLocaleDateString()}</td>
                      <td>{d.contactNumber}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: scoreColor }}>
                          {score}<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[d.status] ?? 'badge-gray'}`}>
                          {d.status}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Drivers;
