import React, { useEffect, useState } from 'react';
import { Route, Plus, Pencil, Trash2, Search } from 'lucide-react';
// import { getTrips } from '../api/trips.api';

const STATUS_BADGE = {
  'Draft':      'badge-gray',
  'Dispatched': 'badge-blue',
  'Completed':  'badge-green',
  'Cancelled':  'badge-red',
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: getTrips().then(res => setTrips(res.data));
  }, []);

  const filtered = trips.filter(
    (t) =>
      t.source?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Trips</h1>
          <p>Dispatch, monitor, and complete fleet trips.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          New Trip
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Trips ({filtered.length})</span>
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search by route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo (kg)</th>
                <th>Distance (km)</th>
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
                        <Route size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No trips found</h3>
                      <p>Create your first trip to start dispatching vehicles and drivers.</p>
                      <button className="btn btn-primary">
                        <Plus size={14} strokeWidth={2.5} /> New Trip
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id}>
                    <td className="td-primary">
                      {t.source}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400, margin: '0 6px' }}>to</span>
                      {t.destination}
                    </td>
                    <td>{t.vehicle?.registrationNumber ?? '—'}</td>
                    <td>{t.driver?.name ?? '—'}</td>
                    <td>{t.cargoWeight}</td>
                    <td>{t.plannedDistance}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-gray'}`}>
                        {t.status}
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

export default Trips;
