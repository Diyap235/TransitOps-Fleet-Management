const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Source location is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required'],
    },
    cargoWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    plannedDistance: {
      type: Number,
      required: [true, 'Planned distance is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    finalOdometer: {
      type: Number,
      default: null,
    },
    fuelConsumed: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
