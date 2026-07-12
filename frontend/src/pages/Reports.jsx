import React, { useState } from 'react';
import { BarChart3, Fuel, Receipt, Route, Download } from 'lucide-react';

const TABS = [
  { id: 'fuel',     label: 'Fuel Logs',     Icon: Fuel    },
  { id: 'expenses', label: 'Expenses',      Icon: Receipt },
  { id: 'trips',    label: 'Trip Summary',  Icon: Route   },
];

const SUMMARY_STATS = [
  { label: 'Total Trips',      value: '—', color: 'blue'   },
  { label: 'Completed',        value: '—', color: 'green'  },
  { label: 'Cancelled',        value: '—', color: 'red'    },
  { label: 'Total Distance',   value: '— km', color: 'purple' },
];

const COLOR_MAP = {
  blue:   { icon: '#2563EB', bg: '#EFF6FF' },
  green:  { icon: '#16A34A', bg: '#F0FDF4' },
  orange: { icon: '#D97706', bg: '#FFFBEB' },
  red:    { icon: '#DC2626', bg: '#FEF2F2' },
  purple: { icon: '#7C3AED', bg: '#F5F3FF' },
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState('fuel');

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports</h1>
          <p>Fuel consumption, expenses, and operational analytics.</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={15} strokeWidth={2} />
          Export CSV
        </button>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-btn${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon size={14} strokeWidth={2} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Fuel Logs */}
      {activeTab === 'fuel' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Fuel Log Records</span>
          </div>
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
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Fuel size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No fuel logs</h3>
                      <p>Fuel records will appear here once drivers start logging fill-ups.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses */}
      {activeTab === 'expenses' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Expense Records</span>
          </div>
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
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Receipt size={22} strokeWidth={1.5} />
                      </div>
                      <h3>No expenses recorded</h3>
                      <p>Vehicle expenses will appear here once they are logged.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      {activeTab === 'trips' && (
        <>
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            {SUMMARY_STATS.map(({ label, value, color }) => {
              const c = COLOR_MAP[color];
              return (
                <div className="stat-card" key={label}>
                  <div className="stat-card-header">
                    <div className="stat-card-icon" style={{ background: c.bg, color: c.icon }}>
                      <BarChart3 size={18} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="stat-card-value">{value}</div>
                  <div className="stat-card-label">{label}</div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Trip Details</span>
            </div>
            <div className="empty-state">
              <div className="empty-state-icon">
                <Route size={22} strokeWidth={1.5} />
              </div>
              <h3>No trip data available</h3>
              <p>Trip summaries will populate once trips are completed.</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Reports;
