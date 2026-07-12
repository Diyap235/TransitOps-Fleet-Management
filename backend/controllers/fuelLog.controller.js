// FuelLog Controller — implement CRUD logic here

const getAllFuelLogs = async (req, res) => {
  // TODO: fetch all fuel logs, optionally filter by vehicle
  res.status(501).json({ message: 'getAllFuelLogs — not yet implemented' });
};

const getFuelLogById = async (req, res) => {
  // TODO: fetch single fuel log by id
  res.status(501).json({ message: 'getFuelLogById — not yet implemented' });
};

const createFuelLog = async (req, res) => {
  // TODO: create new fuel log entry
  res.status(501).json({ message: 'createFuelLog — not yet implemented' });
};

const updateFuelLog = async (req, res) => {
  // TODO: update fuel log entry
  res.status(501).json({ message: 'updateFuelLog — not yet implemented' });
};

const deleteFuelLog = async (req, res) => {
  // TODO: remove fuel log entry
  res.status(501).json({ message: 'deleteFuelLog — not yet implemented' });
};

module.exports = { getAllFuelLogs, getFuelLogById, createFuelLog, updateFuelLog, deleteFuelLog };
