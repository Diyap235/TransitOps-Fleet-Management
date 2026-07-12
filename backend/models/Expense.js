const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      // Optional - some expenses may be fleet-wide
    },
    category: {
      type: String,
      enum: ['Toll', 'Maintenance', 'Insurance', 'Fine', 'Other'],
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
expenseSchema.index({ vehicle: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ loggedBy: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
