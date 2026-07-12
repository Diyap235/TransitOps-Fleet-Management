// Trip Controller — implement CRUD + dispatch logic here

const getAllTrips = async (req, res) => {
  // TODO: fetch all trips, populate vehicle and driver
  res.status(501).json({ message: 'getAllTrips — not yet implemented' });
};

const getTripById = async (req, res) => {
  // TODO: fetch single trip by id
  res.status(501).json({ message: 'getTripById — not yet implemented' });
};

const createTrip = async (req, res) => {
  // TODO: create new trip in Draft status
  res.status(501).json({ message: 'createTrip — not yet implemented' });
};

const updateTrip = async (req, res) => {
  // TODO: update trip fields / status transitions
  res.status(501).json({ message: 'updateTrip — not yet implemented' });
};

const deleteTrip = async (req, res) => {
  // TODO: cancel or remove trip
  res.status(501).json({ message: 'deleteTrip — not yet implemented' });
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
