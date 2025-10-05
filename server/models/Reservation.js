const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  tableNumber: {
    type: Number
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
reservationSchema.index({ restaurant: 1, date: 1, time: 1 });
reservationSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
