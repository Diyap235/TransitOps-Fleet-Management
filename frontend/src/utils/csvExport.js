// ─── CSV Export Utility ───────────────────────────────────────────────────────

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column definitions: [{ key, label }, ...]
 * @returns {string} CSV string
 */
export const generateCSV = (data, columns) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(row => {
    return columns.map(col => {
      let value = row[col.key];
      
      // Handle nested properties (e.g., 'vehicle.registrationNumber')
      if (col.key.includes('.')) {
        const keys = col.key.split('.');
        value = keys.reduce((obj, k) => obj?.[k], row);
      }
      
      // Handle dates
      if (value instanceof Date) {
        value = value.toLocaleDateString();
      } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        value = new Date(value).toLocaleDateString();
      }
      
      // Escape quotes and wrap in quotes
      if (value === null || value === undefined) {
        return '""';
      }
      
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  }).join('\n');

  return `${headers}\n${rows}`;
};

/**
 * Trigger CSV download
 * @param {string} csv - CSV string content
 * @param {string} filename - Filename for download
 */
export const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export data as CSV with automatic download
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions
 * @param {string} filename - Filename (without extension)
 */
export const exportToCSV = (data, columns, filename) => {
  const csv = generateCSV(data, columns);
  downloadCSV(csv, `${filename}.csv`);
};

// ─── Pre-defined Column Sets ──────────────────────────────────────────────────

export const VEHICLES_COLUMNS = [
  { key: 'registrationNumber', label: 'Registration' },
  { key: 'model', label: 'Model' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'fuelLevel', label: 'Fuel Level (%)' },
  { key: 'odometer', label: 'Odometer (km)' },
];

export const DRIVERS_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'status', label: 'Status' },
  { key: 'experience', label: 'Experience (years)' },
  { key: 'rating', label: 'Rating' },
];

export const TRIPS_COLUMNS = [
  { key: 'id', label: 'Trip ID' },
  { key: 'vehicle.registrationNumber', label: 'Vehicle' },
  { key: 'driver.name', label: 'Driver' },
  { key: 'route', label: 'Route' },
  { key: 'distance', label: 'Distance (km)' },
  { key: 'status', label: 'Status' },
  { key: 'startDate', label: 'Start Date' },
];

export const MAINTENANCE_COLUMNS = [
  { key: 'vehicle.registrationNumber', label: 'Vehicle' },
  { key: 'description', label: 'Issue' },
  { key: 'cost', label: 'Cost ($)' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

export const FUEL_LOGS_COLUMNS = [
  { key: 'vehicle.registrationNumber', label: 'Vehicle' },
  { key: 'liters', label: 'Liters' },
  { key: 'cost', label: 'Cost ($)' },
  { key: 'odometerReading', label: 'Odometer (km)' },
  { key: 'date', label: 'Date' },
  { key: 'loggedBy.name', label: 'Logged By' },
];

export const EXPENSES_COLUMNS = [
  { key: 'vehicle.registrationNumber', label: 'Vehicle' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount ($)' },
  { key: 'date', label: 'Date' },
  { key: 'note', label: 'Note' },
  { key: 'loggedBy.name', label: 'Logged By' },
];

export const REPORT_UTILIZATION_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'utilization', label: 'Utilization (%)' },
];

export const REPORT_FUEL_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'efficiency', label: 'Efficiency (km/L)' },
];

export const REPORT_ROI_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'roi', label: 'ROI (%)' },
];

export const REPORT_COST_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'costPerKm', label: 'Cost per km ($)' },
];
