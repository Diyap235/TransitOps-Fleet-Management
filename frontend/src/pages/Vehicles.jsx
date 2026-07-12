import React, { useEffect, useState } from 'react';
// import { getVehicles } from '../api/vehicles.api';

// TODO: implement vehicle list, create, edit, delete UI
const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // TODO: fetch vehicles from API
    // getVehicles().then(res => setVehicles(res.data));
  }, []);

  return (
    <main>
      <h1>Vehicles</h1>
      {/* TODO: add vehicle table and modal/form */}
      <p>Vehicle management coming soon.</p>
    </main>
  );
};

export default Vehicles;
