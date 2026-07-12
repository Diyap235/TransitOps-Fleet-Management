import React, { useEffect, useState } from 'react';
import { Download, TrendingUp, TrendingDown, Gauge, Fuel, DollarSign, BarChart2, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getFuelLogs, getExpenses } from '../api/reports.api';
import { getTrips } from '../api/trips.api';
import { exportFuelLogsCSV, exportExpensesCSV, exportTripSummaryCSV } from '../utils/csvExport';

// ─── Dummy data ───────────────────────────────────────────────────────────────

const fleetUtilizationData = [
  { month: 'Jan', utilization: 68 },
  { month: 'Feb', utilization: 72 },
  { month: 'Mar', utilization: 75 },
  { month: 'Apr', utilization: 70 },
  { month: 'May', utilization: 78 },
  { month: 'Jun', utilization: 74 },
  { month: 'Jul', utilization: 80 },
  { month: 'Aug', utilization: 77 },
  { month: 'Sep', utilization: 82 },
  { month: 'Oct', utilization: 79 },
  { month: 'Nov', utilization: 83 },
  { month: 'Dec', utilization: 82 },
];

const fuelEfficiencyData = [
  { month: 'Jan', efficiency: 5.8 },
  { month: 'Feb', efficiency: 5.9 },
  { month: 'Mar', efficiency: 6.0 },
  { month: 'Apr', efficiency: 5.7 },
  { month: 'May', efficiency: 6.1 },
  { month: 'Jun', efficiency: 6.2 },
  { month: 'Jul', efficiency: 6.0 },
  { month: 'Aug', efficiency: 6.3 },
  { month: 'Sep', efficiency: 6.1 },
  { month: 'Oct', efficiency: 6.4 },
  { month: 'Nov', efficiency: 6.3 },
  { month: 'Dec', efficiency: 6.4 },
];

const vehicleRoiData = [
  { month: 'Jan', roi: 14.2 },
  { month: 'Feb', roi: 14.8 },
  { month: 'Mar', roi: 15.1 },
  { month: 'Apr', roi: 14.5 },
  { month: 'May', roi: 15.6 },
  { month: 'Jun', roi: 15.9 },
  { month: 'Jul', roi: 16.0 },
  { month: 'Aug', roi: 16.4 },
  { month: 'Sep', roi: 16.8 },
  { month: 'Oct', roi: 16.5 },
  { month: 'Nov', roi: 17.0 },
  { month: 'Dec', roi: 17.2 },
];

const costTrendsData = [
  { month: 'Jan', costPerKm: 0.51 },
  { month: 'Feb', costPerKm: 0.49 },
  { month: 'Mar', costPerKm: 0.48 },
  { month: 'Apr', costPerKm: 0.50 },
  { month: 'May', costPerKm: 0.47 },
  { month: 'Jun', costPerKm: 0.46 },
  { month: 'Jul', costPerKm: 0.47 },
  { month: 'Aug', costPerKm: 0.45 },
  { month: 'Sep', costPerKm: 0.44 },
  { month: 'Oct', costPerKm: 0.43 },
  { month: 'Nov', costPerKm: 0.44 },
  { month: 'Dec', costPerKm: 0.42 },
];

// ─── KPI cards config ─────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: 'Fleet Utilization',
    value: '82%',
    trend: '+5.1%',
    up: true,
    icon: Gauge,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
  },
  {
    label: 'Fuel Efficiency',
    value: '6.4 km/L',
    trend: '+1.9%',
    up: true,
    icon: Fuel,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
  },
  {
    label: 'Vehicle ROI',
    value: '17.2%',
    trend: '+1.4%',
    up: true,
    icon: BarChart2,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
  },
  {
    label: 'Cost per KM',
    value: '$0.42',
    trend: '-2.3%',
    up: false,
    icon: DollarSign,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
  },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color, margin: 0 }}>
          {entry.name}: <strong>{entry.value}{unit}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fuelRes, expRes, tripsRes] = await Promise.all([
        getFuelLogs(),
        getExpenses(),
        getTrips(),
      ]);
      setFuelLogs(fuelRes.data || []);
      setExpenses(expRes.data || []);
      setTrips(tripsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    try {
      if (type === 'fuel') {
        exportFuelLogsCSV(fuelLogs);
      } else if (type === 'expenses') {
        exportExpensesCSV(expenses);
      } else if (type === 'trips') {
        exportTripSummaryCSV(trips);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports &amp; Analytics</h1>
          <p>Deep insights into utilization, efficiency and ROI.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <AlertCircle size={16} />
          {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchReportData} style={{ marginLeft: 'auto' }}>Retry</button>
        </div>
      )}

      {/* ── Tab bar for export options ── */}
      <div className="tab-bar" style={{ marginBottom: 28 }}>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'fuel' ? 'active' : ''}`}
          onClick={() => setActiveTab('fuel')}
        >
          Fuel Logs
        </button>
        <button
          className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
          onClick={() => setActiveTab('trips')}
        >
          Trips
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {activeTab === 'fuel' && (
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                color: '#fff',
                boxShadow: '0 1px 3px rgba(22,163,74,0.35)',
              }}
              onClick={() => handleExport('fuel')}
              disabled={loading || fuelLogs.length === 0}
            >
              <Download size={15} strokeWidth={2} />
              Export CSV
            </button>
          )}
          {activeTab === 'expenses' && (
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                color: '#fff',
                boxShadow: '0 1px 3px rgba(22,163,74,0.35)',
              }}
              onClick={() => handleExport('expenses')}
              disabled={loading || expenses.length === 0}
            >
              <Download size={15} strokeWidth={2} />
              Export CSV
            </button>
          )}
          {activeTab === 'trips' && (
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                color: '#fff',
                boxShadow: '0 1px 3px rgba(22,163,74,0.35)',
              }}
              onClick={() => handleExport('trips')}
              disabled={loading || trips.length === 0}
            >
              <Download size={15} strokeWidth={2} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* ── Charts only show on Overview tab ── */}
      {activeTab === 'overview' && !loading && (
        <>
          {/* ── KPI Cards ── */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {KPI_CARDS.map(({ label, value, trend, up, icon: Icon, iconBg, iconColor }) => (
              <div className="stat-card" key={label}>
                <div className="stat-card-header">
                  <div
                    className="stat-card-icon"
                    style={{ background: iconBg, color: iconColor }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span
                    className={up ? 'trend-up' : 'trend-down'}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    {up
                      ? <TrendingUp size={13} strokeWidth={2.5} />
                      : <TrendingDown size={13} strokeWidth={2.5} />}
                    {trend}
                  </span>
                </div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Fleet Utilization Heatmap ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">Weekly Utilization Heatmap</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>7-day view</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const utilization = [75, 82, 68, 90, 78, 45, 52][idx];
                  const color = utilization >= 80 ? '#16A34A' : utilization >= 60 ? '#D97706' : '#EF4444';
                  return (
                    <div key={day} style={{ textAlign: 'center' }}>
                      <div style={{
                        height: 80,
                        background: `linear-gradient(180deg, ${color}20, ${color}05)`,
                        border: `2px solid ${color}40`,
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: 8,
                        position: 'relative',
                      }}>
                        <div style={{
                          width: '100%',
                          height: `${utilization}%`,
                          background: `linear-gradient(180deg, ${color}80, ${color}40)`,
                          borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          top: 4,
                          left: 0,
                          right: 0,
                          fontSize: 12,
                          fontWeight: 700,
                          color: color,
                        }}>
                          {utilization}%
                        </div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 8 }}>{day}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 20, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: '#16A34A', borderRadius: 3 }}></div>
                  <span>High (80-100%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: '#D97706', borderRadius: 3 }}></div>
                  <span>Medium (60-79%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: '#EF4444', borderRadius: 3 }}></div>
                  <span>Low (0-59%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts – top row ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
              marginBottom: 20,
            }}
          >
            {/* Fleet Utilization – Area */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Fleet Utilization</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Last 12 months (%)</span>
              </div>
              <div className="card-body" style={{ padding: '16px 8px 8px' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={fleetUtilizationData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Area
                      type="monotone"
                      dataKey="utilization"
                      name="Utilization"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fill="url(#gradUtil)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fuel Efficiency – Bar */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Fuel Efficiency</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Last 12 months (km/L)</span>
              </div>
              <div className="card-body" style={{ padding: '16px 8px 8px' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={fuelEfficiencyData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[5.4, 6.6]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip unit=" km/L" />} />
                    <Bar
                      dataKey="efficiency"
                      name="Efficiency"
                      fill="#16A34A"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Charts – bottom row ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {/* Vehicle ROI – Line */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Vehicle ROI</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Last 12 months (%)</span>
              </div>
              <div className="card-body" style={{ padding: '16px 8px 8px' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={vehicleRoiData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[13, 18]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      name="ROI"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#7C3AED', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#7C3AED', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Trends – Line */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Cost Trends</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Last 12 months ($/km)</span>
              </div>
              <div className="card-body" style={{ padding: '16px 8px 8px' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={costTrendsData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0.38, 0.55]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip unit=" $/km" />} />
                    <Line
                      type="monotone"
                      dataKey="costPerKm"
                      name="Cost/km"
                      stroke="#EA580C"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#EA580C', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#EA580C', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: 'var(--text-muted)' }}>Loading report data...</div>
        </div>
      )}
    </>
  );
};

export default Reports;
