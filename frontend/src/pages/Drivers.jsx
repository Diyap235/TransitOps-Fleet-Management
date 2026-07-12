import React, { useEffect, useState } from 'react';
// import { getDrivers } from '../api/drivers.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'Off Duty':  'badge-gray',
  'Suspended': 'badge-red',
};

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // TODO: getDrivers().then(res => setDrivers(res.data));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Drivers</h1>
        <button className="btn btn-primary">+ Add Driver</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Category</th>
                <th>License Expiry</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No drivers yet. Click <strong>+ Add Driver</strong> to get started.
                  </td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.licenseNumber}</td>
                    <td>{d.licenseCategory}</td>
                    <td>{new Date(d.licenseExpiryDate).toLocaleDateString()}</td>
                    <td>{d.contactNumber}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: d.safetyScore >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                        {d.safetyScore}/100
                      </span>
                    </td>
                    <td><span className={`badge ${STATUS_BADGE[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 10px', marginRight: 6 }}>Edit</button>
                      <button className="btn btn-danger"  style={{ padding: '4px 10px' }}>Delete</button>
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

export default Drivers;
