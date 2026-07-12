import React, { useState } from 'react';
// import { getFuelLogs, getExpenses } from '../api/reports.api';

const TABS = ['Fuel Logs', 'Expenses', 'Trip Summary'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Fuel Logs');

  return (
    <>
      <div className="page-header">
        <h1>Reports</h1>
        <button className="btn btn-outline">⬇ Export CSV</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 18px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--muted)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Fuel Logs */}
      {activeTab === 'Fuel Logs' && (
        <div className="card">
          <div className="card-title">Fuel Log Records</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Liters</th>
                  <th>Cost</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No fuel logs yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses */}
      {activeTab === 'Expenses' && (
        <div className="card">
          <div className="card-title">Expense Records</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No expenses recorded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      {activeTab === 'Trip Summary' && (
        <div className="card">
          <div className="card-title">Trip Summary</div>
          <div className="stats-grid" style={{ marginBottom: 0 }}>
            {[
              { label: 'Total Trips',     value: '—', cls: 'blue'   },
              { label: 'Completed',       value: '—', cls: 'green'  },
              { label: 'Cancelled',       value: '—', cls: 'red'    },
              { label: 'Total Distance',  value: '— km', cls: 'orange' },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="label">{s.label}</div>
                <div className={`value ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
