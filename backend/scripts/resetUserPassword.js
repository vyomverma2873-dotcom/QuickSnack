const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetUserPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'officialvyom@gmail.com'; // Your email from the logs
    const newPassword = 'newpassword123';

    // Find and update user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('👤 Found user:', user.name);
    console.log('📧 Email:', user.email);
    console.log('✅ Verified:', user.isVerified);

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    console.log('\n✅ Password reset successfully!');
    console.log('\n📋 Updated Credentials:');
    console.log('Email:', email);
    console.log('Password:', newPassword);
    console.log('\nYou can now use these credentials to login.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
}

resetUserPassword();
