const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@quicksnack.com' });
    if (existingUser) {
      console.log('Test user already exists, updating password...');
      existingUser.passwordHash = 'test123'; // Will be hashed by pre-save middleware
      await existingUser.save();
      console.log('✅ Test user password updated!');
    } else {
      // Create test user
      const testUser = new User({
        name: 'Test User',
        email: 'test@quicksnack.com',
        phone: '1234567890',
        passwordHash: 'test123', // Will be hashed by pre-save middleware
        isVerified: true,
        role: 'user'
      });

      await testUser.save();
      console.log('✅ Test user created successfully!');
    }

    console.log('\n📋 Test User Credentials:');
    console.log('Email: test@quicksnack.com');
    console.log('Password: test123');
    console.log('\nYou can now use these credentials to login.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
