// Driver Controller — implement CRUD logic here

const getAllDrivers = async (req, res) => {
  // TODO: fetch all drivers with optional filters
  res.status(501).json({ message: 'getAllDrivers — not yet implemented' });
};

const getDriverById = async (req, res) => {
  // TODO: fetch single driver by id
  res.status(501).json({ message: 'getDriverById — not yet implemented' });
};

const createDriver = async (req, res) => {
  // TODO: create new driver
  res.status(501).json({ message: 'createDriver — not yet implemented' });
};

const updateDriver = async (req, res) => {
  // TODO: update driver fields
  res.status(501).json({ message: 'updateDriver — not yet implemented' });
};

const deleteDriver = async (req, res) => {
  // TODO: remove driver
  res.status(501).json({ message: 'deleteDriver — not yet implemented' });
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
