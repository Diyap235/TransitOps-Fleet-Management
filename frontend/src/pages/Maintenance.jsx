import React, { useEffect, useState } from 'react';
// import { getMaintenanceRecords } from '../api/maintenance.api';

// TODO: implement maintenance list, create, close UI
const Maintenance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // TODO: fetch maintenance records from API
    // getMaintenanceRecords().then(res => setRecords(res.data));
  }, []);

  return (
    <main>
      <h1>Maintenance</h1>
      {/* TODO: add maintenance table and modal/form */}
      <p>Maintenance management coming soon.</p>
    </main>
  );
};

export default Maintenance;
