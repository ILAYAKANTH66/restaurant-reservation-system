require('dotenv').config();
const connectDB = require('../config/database');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Run seed data
    await seedData();
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

runSeed();
