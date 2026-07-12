const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
    },
    maxLoadCapacity: {
      type: Number,
      required: [true, 'Max load capacity is required'],
      min: [0, 'Max load capacity must be positive'],
      validate: {
        validator: function(value) {
          // Define realistic max load capacities per vehicle type
          const CAPACITY_LIMITS = {
            'Auto Rickshaw': 500,
            'Sedan': 200,
            'MPV': 2000,
            'SUV': 2500,
            'Pickup': 3000,
            'Tempo': 5000,
            'Light Truck': 5000,
            'Medium Truck': 10000,
            'Heavy Truck': 25000,
            'Trailer': 50000,
          };
          
          const typeKey = Object.keys(CAPACITY_LIMITS).find(k => 
            this.type?.toLowerCase().includes(k.toLowerCase()) || 
            k.toLowerCase().includes(this.type?.toLowerCase())
          );
          
          if (typeKey) {
            return value <= CAPACITY_LIMITS[typeKey];
          }
          
          // Generic check: capacity should not exceed 100,000 kg
          return value <= 100000;
        },
        message: 'Max load capacity is unrealistic for this vehicle type. Please check the value.'
      }
    },
    odometer: {
      type: Number,
      default: 0,
      min: 0,
    },
    acquisitionCost: {
      type: Number,
      required: [true, 'Acquisition cost is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
