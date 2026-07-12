import React from 'react';

// ─── Individual Skeleton Components ──────────────────────────────────────────

export const SkeletonText = ({ width = '100%', height = 14, className = '' }) => (
  <div 
    className={`skeleton skeleton-text ${className}`} 
    style={{ width, height }}
  />
);

export const SkeletonCard = ({ height = 120, className = '' }) => (
  <div 
    className={`skeleton skeleton-card ${className}`} 
    style={{ height }}
  />
);

export const SkeletonStatCard = () => (
  <div className="skeleton skeleton-stat-card" />
);

export const SkeletonTableRow = () => (
  <div className="skeleton skeleton-table-row" />
);

// ─── Page-Specific Loading Skeletons ─────────────────────────────────────────

export const DashboardSkeleton = () => (
  <div className="page-body">
    <div className="page-header">
      <div className="page-header-left">
        <SkeletonText width="200px" height={24} className="large" />
        <SkeletonText width="300px" height={14} />
      </div>
      <SkeletonText width="120px" height={36} />
    </div>

    {/* KPI Cards Skeleton */}
    <div className="stats-grid" style={{ marginBottom: 28 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>

    {/* Quick Actions & Recent Items */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
      <SkeletonCard height={300} />
      <SkeletonCard height={300} />
    </div>
  </div>
);

export const TablePageSkeleton = ({ title, hasStats = false, rowCount = 8 }) => (
  <div className="page-body">
    <div className="page-header">
      <div className="page-header-left">
        <SkeletonText width={title?.length ? `${title.length * 12}px` : '150px'} height={24} className="large" />
        <SkeletonText width="250px" height={14} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <SkeletonText width="100px" height={36} />
        <SkeletonText width="140px" height={36} />
      </div>
    </div>

    {/* Optional Stats Cards */}
    {hasStats && (
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    )}

    {/* Table Card */}
    <div className="card">
      <div className="card-header">
        <SkeletonText width="120px" height={16} />
        <SkeletonText width="200px" height={32} />
      </div>
      <div className="card-body" style={{ padding: '8px 0' }}>
        {Array.from({ length: rowCount }, (_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const ReportsSkeleton = () => (
  <div className="page-body">
    <div className="page-header">
      <div className="page-header-left">
        <SkeletonText width="200px" height={24} className="large" />
        <SkeletonText width="300px" height={14} />
      </div>
      <SkeletonText width="140px" height={36} />
    </div>

    {/* KPI Cards */}
    <div className="stats-grid" style={{ marginBottom: 28 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>

    {/* Charts Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
      <SkeletonCard height={280} />
      <SkeletonCard height={280} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
      <SkeletonCard height={280} />
      <SkeletonCard height={280} />
    </div>
  </div>
);

// ─── Generic Loading Skeleton Component ──────────────────────────────────────

const LoadingSkeleton = ({ type = 'table', title = '', hasStats = false, rowCount = 8 }) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'reports':
      return <ReportsSkeleton />;
    case 'table':
    default:
      return <TablePageSkeleton title={title} hasStats={hasStats} rowCount={rowCount} />;
  }
};

export default LoadingSkeleton;