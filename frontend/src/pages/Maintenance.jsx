import React, { useEffect, useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, Search, Calendar } from 'lucide-react';
// import { getMaintenanceRecords } from '../api/maintenance.api';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: getMaintenanceRecords().then(res => setRecords(res.data));
  }, []);

  const filtered = records.filter(
    (r) =>
      r.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Maintenance</h1>
          <p>Track and manage vehicle service and repair records.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          Log Maintenance
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Records ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Wrench size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No maintenance records</h3>
                      <p>Log vehicle maintenance to keep track of service history and costs.</p>
                      <button className="btn btn-primary">
                        <Plus size={14} strokeWidth={2.5} /> Log Maintenance
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id}>
                    <td className="td-primary">{r.vehicle?.registrationNumber ?? '—'}</td>
                    <td>{r.description}</td>
                    <td>${r.cost?.toLocaleString()}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={r.status === 'Active' ? 'badge badge-orange' : 'badge badge-green'}>
                        {r.status}
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

export default Maintenance;
