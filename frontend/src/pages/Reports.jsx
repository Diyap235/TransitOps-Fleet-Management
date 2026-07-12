import React, { useState, useRef } from 'react';
import { Download, TrendingUp, TrendingDown, Gauge, Fuel, DollarSign, BarChart2, FileText, FileType, Sheet } from 'lucide-react';
import { exportToCSV, REPORT_UTILIZATION_COLUMNS, REPORT_FUEL_COLUMNS, REPORT_ROI_COLUMNS, REPORT_COST_COLUMNS } from '../utils/csvExport';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

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
    value: '₹0.42',
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

// ─── Export helpers ───────────────────────────────────────────────────────────

const exportAsTxt = () => {
  const now = new Date().toLocaleString();
  const lines = [
    '================================================',
    '         TRANSITOPS — ANALYTICS REPORT          ',
    '================================================',
    `Generated: ${now}`,
    '',
    '── KPI SUMMARY ─────────────────────────────────',
    `Fleet Utilization   : 82%    (+5.1% vs last period)`,
    `Fuel Efficiency     : 6.4 km/L  (+1.9%)`,
    `Vehicle ROI         : 17.2%  (+1.4%)`,
    `Cost per KM         : ₹0.42  (-2.3%)`,
    '',
    '── FLEET UTILIZATION (Last 12 months) ───────────',
    'Month   Utilization(%)',
    ...fleetUtilizationData.map(d => `${d.month.padEnd(8)}${d.utilization}%`),
    '',
    '── FUEL EFFICIENCY (Last 12 months) ─────────────',
    'Month   km/L',
    ...fuelEfficiencyData.map(d => `${d.month.padEnd(8)}${d.efficiency}`),
    '',
    '── VEHICLE ROI (Last 12 months) ─────────────────',
    'Month   ROI(%)',
    ...vehicleRoiData.map(d => `${d.month.padEnd(8)}${d.roi}%`),
    '',
    '── COST TRENDS (Last 12 months) ─────────────────',
    'Month   Cost/km($)',
    ...costTrendsData.map(d => `${d.month.padEnd(8)}$${d.costPerKm}`),
    '',
    '================================================',
    '  TransitOps — Smart Transport Operations       ',
    '================================================',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `transitops-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportAsPdf = (reportRef) => {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body * { visibility: hidden; }
      #report-print-area, #report-print-area * { visibility: visible; }
      #report-print-area {
        position: fixed; top: 0; left: 0; width: 100%;
        background: #fff; color: #000; padding: 24px;
      }
      .recharts-wrapper { page-break-inside: avoid; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  document.head.removeChild(style);
};

// ─── Component ────────────────────────────────────────────────────────────────

const Reports = () => {
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const reportRef = useRef(null);
  const hasReportData = fleetUtilizationData.length > 0
    || fuelEfficiencyData.length > 0
    || vehicleRoiData.length > 0
    || costTrendsData.length > 0;

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports &amp; Analytics</h1>
          <p>Deep insights into utilization, efficiency and ROI.</p>
        </div>

        {/* Export button with dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn"
            style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)', color: '#fff', boxShadow: '0 1px 3px rgba(22,163,74,0.35)' }}
            onClick={() => setShowFormatMenu(v => !v)}
          >
            <Download size={15} strokeWidth={2} />
            Export Report
          </button>

          {showFormatMenu && (
            <>
              {/* backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setShowFormatMenu(false)}
              />
              {/* dropdown */}
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 99,
                background: '#fff', border: '1px solid #E5E7EB',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Choose format
                </div>
                <button
                  onClick={() => { exportAsTxt(); setShowFormatMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#111827', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ width: 32, height: 32, borderRadius: 7, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                    <FileText size={16} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Export as TXT</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Plain text report file</div>
                  </div>
                </button>
                <button
                  onClick={() => { exportAsPdf(reportRef); setShowFormatMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#111827', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ width: 32, height: 32, borderRadius: 7, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', flexShrink: 0 }}>
                    <FileType size={16} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Export as PDF</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Print to PDF via browser</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Printable area starts here ── */}
      <div id="report-print-area" ref={reportRef}>

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

      {!hasReportData && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="empty-state">
            <div className="empty-state-icon"><BarChart3 size={22} strokeWidth={1.5} /></div>
            <h3>No reports available yet</h3>
            <p>Generate fleet insights once your data is synced to see charts and trend metrics.</p>
          </div>
        </div>
      )}

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
      </div> {/* end printable area */}
    </>
  );
};

export default Reports;
