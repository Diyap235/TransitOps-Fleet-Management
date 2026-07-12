/**
 * Convert array of objects to CSV string
 * Properly handles escaping of commas, quotes, and newlines
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  // Escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build header row
  const headerRow = headers.map(h => escapeCSV(h)).join(',');

  // Build data rows
  const dataRows = data.map(row =>
    Object.values(row)
      .map(val => escapeCSV(val))
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Trigger file download
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export fuel logs as CSV
 */
export const exportFuelLogsCSV = (fuelLogs) => {
  const headers = ['Date', 'Vehicle', 'Quantity (L)', 'Cost ($)', 'Odometer (km)'];
  const data = fuelLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    vehicle: log.vehicle?.name || 'Unknown',
    quantity: log.quantity,
    cost: log.cost,
    odometer: log.odometer,
  }));

  const csv = convertToCSV(data, headers);
  const filename = `fuel-logs-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export expenses as CSV
 */
export const exportExpensesCSV = (expenses) => {
  const headers = ['Date', 'Category', 'Amount ($)', 'Description', 'Vehicle'];
  const data = expenses.map(exp => ({
    date: new Date(exp.date).toLocaleDateString(),
    category: exp.category,
    amount: exp.amount,
    description: exp.description,
    vehicle: exp.vehicle?.name || 'General',
  }));

  const csv = convertToCSV(data, headers);
  const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export trip summary as CSV
 */
export const exportTripSummaryCSV = (trips) => {
  const headers = ['Trip ID', 'Vehicle', 'Driver', 'Status', 'Source', 'Destination', 'Distance (km)', 'Date'];
  const data = trips.map(trip => ({
    tripId: trip._id?.substring(0, 8) || 'N/A',
    vehicle: trip.vehicle?.name || 'Unknown',
    driver: trip.driver?.name || 'Unknown',
    status: trip.status,
    source: trip.source,
    destination: trip.destination,
    distance: trip.plannedDistance,
    date: new Date(trip.createdAt).toLocaleDateString(),
  }));

  const csv = convertToCSV(data, headers);
  const filename = `trip-summary-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};
