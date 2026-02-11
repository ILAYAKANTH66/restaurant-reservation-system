const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Import models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1234567891',
    role: 'restaurant_owner'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    phone: '+1234567892',
    role: 'admin'
  }
];

const sampleRestaurants = [
  {
    name: 'Italian Delight',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes. Perfect for romantic dinners and family gatherings.',
    cuisine: 'Italian',
    phone: '+1234567890',
    email: 'info@italiandelight.com',
    website: 'https://italiandelight.com',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    capacity: 50,
    priceRange: '\u20B9\u20B9',
    rating: 4.5,
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    features: ['outdoor_seating', 'private_rooms', 'wifi'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500']
  },
  {
    name: 'Sushi Master',
    description: 'Premium sushi and Japanese cuisine prepared by master chefs. Fresh fish daily and authentic Japanese atmosphere.',
    cuisine: 'Japanese',
    phone: '+1234567891',
    email: 'info@sushimaster.com',
    website: 'https://sushimaster.com',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    capacity: 30,
    priceRange: '\u20B9\u20B9\u20B9',
    rating: 4.8,
    openingHours: {
      monday: { open: '11:30', close: '21:30' },
      tuesday: { open: '11:30', close: '21:30' },
      wednesday: { open: '11:30', close: '21:30' },
      thursday: { open: '11:30', close: '21:30' },
      friday: { open: '11:30', close: '22:30' },
      saturday: { open: '12:00', close: '22:30' },
      sunday: { open: '12:00', close: '21:00' }
    },
    features: ['private_rooms', 'wifi', 'parking'],
    images: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500']
  },
  {
    name: 'Burger Haven',
    description: 'Gourmet burgers and comfort food in a casual, family-friendly atmosphere. Made with locally sourced ingredients.',
    cuisine: 'American',
    phone: '+1234567892',
    email: 'info@burgerhaven.com',
    website: 'https://burgerhaven.com',
    address: {
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    capacity: 80,
    priceRange: '\u20B9',
    rating: 4.2,
    openingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '12:00', close: '00:00' },
      sunday: { open: '12:00', close: '22:00' }
    },
    features: ['takeout', 'delivery', 'wifi'],
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500']
  },
  {
    name: 'Thai Spice',
    description: 'Authentic Thai cuisine with bold flavors and fresh herbs. Traditional recipes passed down through generations.',
    cuisine: 'Thai',
    phone: '+1234567893',
    email: 'info@thaispice.com',
    website: 'https://thaispice.com',
    address: {
      street: '321 Elm Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    capacity: 45,
    priceRange: '\u20B9\u20B9',
    rating: 4.6,
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    features: ['wifi', 'parking', 'takeout'],
    images: ['https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500']
  },
  {
    name: 'French Bistro',
    description: 'Elegant French bistro serving classic dishes with a modern twist. Perfect for special occasions and romantic dinners.',
    cuisine: 'French',
    phone: '+1234567894',
    email: 'info@frenchbistro.com',
    website: 'https://frenchbistro.com',
    address: {
      street: '654 Maple Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    capacity: 35,
    priceRange: '\u20B9\u20B9\u20B9',
    rating: 4.7,
    openingHours: {
      monday: { open: '17:00', close: '22:00' },
      tuesday: { open: '17:00', close: '22:00' },
      wednesday: { open: '17:00', close: '22:00' },
      thursday: { open: '17:00', close: '22:00' },
      friday: { open: '17:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' }
    },
    features: ['private_rooms', 'wifi', 'parking'],
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-reservation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        isActive: true
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    // Create restaurants
    const restaurantOwner = createdUsers.find(user => user.role === 'restaurant_owner');
    
    for (const restaurantData of sampleRestaurants) {
      const restaurant = new Restaurant({
        ...restaurantData,
        owner: restaurantOwner._id,
        isActive: true
      });
      await restaurant.save();
      console.log(`Created restaurant: ${restaurant.name}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Customer: john@example.com / password123');
    console.log('Restaurant Owner: jane@example.com / password123');
    console.log('Admin: admin@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
