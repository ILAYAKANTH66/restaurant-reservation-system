const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  priceRange: {
    type: String,
    enum: ['\u20B9', '\u20B9\u20B9', '\u20B9\u20B9\u20B9', '\u20B9\u20B9\u20B9\u20B9'],
    default: '\u20B9\u20B9'
  },
  capacity: {
    type: Number,
    required: true
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  features: [{
    type: String,
    enum: ['wifi', 'parking', 'delivery', 'takeout', 'outdoor_seating', 'private_rooms']
  }],
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
