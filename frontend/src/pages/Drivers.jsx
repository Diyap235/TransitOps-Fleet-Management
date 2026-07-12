import React, { useEffect, useState } from 'react';
// import { getDrivers } from '../api/drivers.api';

// TODO: implement driver list, create, edit, delete UI
const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // TODO: fetch drivers from API
    // getDrivers().then(res => setDrivers(res.data));
  }, []);

  return (
    <main>
      <h1>Drivers</h1>
      {/* TODO: add driver table and modal/form */}
      <p>Driver management coming soon.</p>
    </main>
  );
};

export default Drivers;
