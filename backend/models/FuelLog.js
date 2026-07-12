const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    liters: {
      type: Number,
      required: [true, 'Liters is required'],
      min: [0, 'Liters cannot be negative'],
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    odometerReading: {
      type: Number,
      min: [0, 'Odometer reading cannot be negative'],
    },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
fuelLogSchema.index({ vehicle: 1, date: -1 });
fuelLogSchema.index({ loggedBy: 1 });

module.exports = mongoose.model('FuelLog', fuelLogSchema);
