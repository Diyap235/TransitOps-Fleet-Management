import React, { useEffect, useState } from 'react';
// import { getMaintenanceRecords } from '../api/maintenance.api';

const Maintenance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // TODO: getMaintenanceRecords().then(res => setRecords(res.data));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Maintenance</h1>
        <button className="btn btn-primary">+ Log Maintenance</button>
      </div>

      <div className="card">
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
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No maintenance records. Click <strong>+ Log Maintenance</strong> to add one.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r._id}>
                    <td>{r.vehicle?.registrationNumber ?? '—'}</td>
                    <td>{r.description}</td>
                    <td>${r.cost?.toLocaleString()}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      <span className={r.status === 'Active' ? 'badge badge-orange' : 'badge badge-green'}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 10px', marginRight: 6 }}>Edit</button>
                      {r.status === 'Active' && (
                        <button className="btn btn-primary" style={{ padding: '4px 10px' }}>Close</button>
                      )}
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
