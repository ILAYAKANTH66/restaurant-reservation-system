require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');

const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Connect to database
    await connectDB();
    
    console.log('✅ Database connection successful');
    
    // Test basic operations
    console.log('\nTesting basic operations...');
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`✅ User count: ${userCount}`);
    
    // Test user creation
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword',
      phone: '+1234567890',
      role: 'customer'
    });
    
    await testUser.save();
    console.log('✅ User creation successful');
    
    // Test user retrieval
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log(`✅ User retrieval successful: ${foundUser.name}`);
    
    // Clean up test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user cleanup successful');
    
    console.log('\n🎉 All database tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

testDatabase();
