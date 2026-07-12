import React, { useEffect, useState } from 'react';
// import { getTrips } from '../api/trips.api';

const STATUS_BADGE = {
  'Draft':      'badge-gray',
  'Dispatched': 'badge-blue',
  'Completed':  'badge-green',
  'Cancelled':  'badge-red',
};

const Trips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // TODO: getTrips().then(res => setTrips(res.data));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Trips</h1>
        <button className="btn btn-primary">+ New Trip</button>
      </div>

      <div className="card">
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
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No trips yet. Click <strong>+ New Trip</strong> to dispatch one.
                  </td>
                </tr>
              ) : (
                trips.map((t) => (
                  <tr key={t._id}>
                    <td><strong>{t.source}</strong> → {t.destination}</td>
                    <td>{t.vehicle?.registrationNumber ?? '—'}</td>
                    <td>{t.driver?.name ?? '—'}</td>
                    <td>{t.cargoWeight}</td>
                    <td>{t.plannedDistance}</td>
                    <td><span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-gray'}`}>{t.status}</span></td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 10px', marginRight: 6 }}>Edit</button>
                      <button className="btn btn-danger"  style={{ padding: '4px 10px' }}>Cancel</button>
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
