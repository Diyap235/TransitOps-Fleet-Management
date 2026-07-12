import React, { useEffect, useState } from 'react';
// import { getTrips } from '../api/trips.api';

// TODO: implement trip list, dispatch, complete, cancel UI
const Trips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // TODO: fetch trips from API
    // getTrips().then(res => setTrips(res.data));
  }, []);

  return (
    <main>
      <h1>Trips</h1>
      {/* TODO: add trip table and modal/form */}
      <p>Trip management coming soon.</p>
    </main>
  );
};

export default Trips;
