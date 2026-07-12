import React from 'react';
import { useAuth } from '../context/AuthContext';

// TODO: fetch summary stats (total vehicles, active trips, pending maintenance, etc.)
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name ?? 'User'}</p>

      {/* TODO: summary stat cards */}
      <section aria-label="Summary statistics">
        <article>
          <h2>Vehicles</h2>
          <p>— stats coming soon —</p>
        </article>
        <article>
          <h2>Active Trips</h2>
          <p>— stats coming soon —</p>
        </article>
        <article>
          <h2>Maintenance</h2>
          <p>— stats coming soon —</p>
        </article>
        <article>
          <h2>Expenses</h2>
          <p>— stats coming soon —</p>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
