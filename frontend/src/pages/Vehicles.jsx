import React, { useEffect, useState } from 'react';
// import { getVehicles } from '../api/vehicles.api';

const STATUS_BADGE = {
  'Available': 'badge-green',
  'On Trip':   'badge-blue',
  'In Shop':   'badge-orange',
  'Retired':   'badge-gray',
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // TODO: getVehicles().then(res => setVehicles(res.data));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Vehicles</h1>
        <button className="btn btn-primary">+ Add Vehicle</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reg. Number</th>
                <th>Name</th>
                <th>Type</th>
                <th>Max Load (kg)</th>
                <th>Odometer (km)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No vehicles yet. Click <strong>+ Add Vehicle</strong> to get started.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v._id}>
                    <td><strong>{v.registrationNumber}</strong></td>
                    <td>{v.name}</td>
                    <td>{v.type}</td>
                    <td>{v.maxLoadCapacity}</td>
                    <td>{v.odometer?.toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-gray'}`}>{v.status}</span></td>
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

export default Vehicles;
