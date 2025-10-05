const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Reservation.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      phone: '+1234567890',
      role: 'admin',
      isActive: true
    });

    // Create restaurant owner
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const owner = await User.create({
      name: 'Restaurant Owner',
      email: 'owner@example.com',
      password: ownerPassword,
      phone: '+1234567891',
      role: 'restaurant_owner',
      isActive: true
    });

    // Create customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+1234567892',
      role: 'customer',
      isActive: true
    });

    console.log('Created users');

    // Create restaurants
    const restaurant1 = await Restaurant.create({
      name: 'Italian Delight',
      description: 'Authentic Italian cuisine with a modern twist. Fresh ingredients and traditional recipes.',
      cuisine: 'Italian',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      phone: '+1234567890',
      email: 'info@italiandelight.com',
      website: 'https://italiandelight.com',
      rating: 4.5,
      priceRange: '$$$',
      capacity: 50,
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      },
      features: ['wifi', 'parking', 'outdoor_seating'],
      menu: [
        { name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 18, category: 'Pizza' },
        { name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta', price: 22, category: 'Pasta' },
        { name: 'Tiramisu', description: 'Classic Italian dessert', price: 12, category: 'Dessert' }
      ],
      owner: owner._id,
      isActive: true
    });

    const restaurant2 = await Restaurant.create({
      name: 'Sushi Master',
      description: 'Fresh sushi and Japanese cuisine prepared by master chefs.',
      cuisine: 'Japanese',
      address: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      phone: '+1234567891',
      email: 'info@sushimaster.com',
      website: 'https://sushimaster.com',
      rating: 4.8,
      priceRange: '$$$$',
      capacity: 30,
      openingHours: {
        monday: { open: '17:00', close: '22:00' },
        tuesday: { open: '17:00', close: '22:00' },
        wednesday: { open: '17:00', close: '22:00' },
        thursday: { open: '17:00', close: '22:00' },
        friday: { open: '17:00', close: '23:00' },
        saturday: { open: '17:00', close: '23:00' },
        sunday: { open: '17:00', close: '21:00' }
      },
      features: ['wifi', 'private_rooms'],
      menu: [
        { name: 'Salmon Sashimi', description: 'Fresh Atlantic salmon', price: 28, category: 'Sashimi' },
        { name: 'Dragon Roll', description: 'Eel and avocado roll', price: 24, category: 'Rolls' },
        { name: 'Miso Soup', description: 'Traditional Japanese soup', price: 8, category: 'Soup' }
      ],
      owner: owner._id,
      isActive: true
    });

    const restaurant3 = await Restaurant.create({
      name: 'Burger Joint',
      description: 'Classic American burgers with a gourmet twist.',
      cuisine: 'American',
      address: {
        street: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      phone: '+1234567892',
      email: 'info@burgerjoint.com',
      website: 'https://burgerjoint.com',
      rating: 4.2,
      priceRange: '$$',
      capacity: 40,
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      },
      features: ['delivery', 'takeout'],
      menu: [
        { name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 15, category: 'Burgers' },
        { name: 'BBQ Bacon Burger', description: 'Beef patty with bacon and BBQ sauce', price: 18, category: 'Burgers' },
        { name: 'Sweet Potato Fries', description: 'Crispy sweet potato fries', price: 8, category: 'Sides' }
      ],
      owner: owner._id,
      isActive: true
    });

    console.log('Created restaurants');

    // Create sample reservations
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(20, 0, 0, 0);

    await Reservation.create([
      {
        restaurant: restaurant1._id,
        user: customer._id,
        date: tomorrow,
        time: '19:00',
        partySize: 4,
        specialRequests: 'Window seat if possible',
        contactName: 'John Customer',
        contactPhone: '+1234567892',
        status: 'pending'
      },
      {
        restaurant: restaurant2._id,
        user: customer._id,
        date: nextWeek,
        time: '20:00',
        partySize: 2,
        specialRequests: 'Quiet table',
        contactName: 'John Customer',
        contactPhone: '+1234567892',
        status: 'confirmed'
      }
    ]);

    console.log('Created reservations');

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Owner: owner@example.com / owner123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;
