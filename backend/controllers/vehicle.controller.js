// Vehicle Controller — implement CRUD logic here

const getAllVehicles = async (req, res) => {
  // TODO: fetch all vehicles with optional filters
  res.status(501).json({ message: 'getAllVehicles — not yet implemented' });
};

const getVehicleById = async (req, res) => {
  // TODO: fetch single vehicle by id
  res.status(501).json({ message: 'getVehicleById — not yet implemented' });
};

const createVehicle = async (req, res) => {
  // TODO: create new vehicle
  res.status(501).json({ message: 'createVehicle — not yet implemented' });
};

const updateVehicle = async (req, res) => {
  // TODO: update vehicle fields
  res.status(501).json({ message: 'updateVehicle — not yet implemented' });
};

const deleteVehicle = async (req, res) => {
  // TODO: soft-delete or remove vehicle
  res.status(501).json({ message: 'deleteVehicle — not yet implemented' });
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
