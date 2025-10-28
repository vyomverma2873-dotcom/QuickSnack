#!/usr/bin/env node

/**
 * Quick test script to verify Resend API is working
 * Run: node test-resend.js
 */

require('dotenv').config();
const { sendEmail, generateOTPEmail } = require('./services/emailService');

async function testResendEmail() {
  console.log('\n🧪 Testing Resend Email Service...\n');
  
  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in environment variables');
    process.exit(1);
  }
  
  console.log('✅ RESEND_API_KEY is set');
  console.log(`   Length: ${process.env.RESEND_API_KEY.length} characters`);
  console.log(`   Starts with: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
  
  // Test email address
  const testEmail = process.env.EMAIL_USER || 'vyomverma2873@gmail.com';
  console.log(`\n📧 Sending test email to: ${testEmail}`);
  
  try {
    const result = await sendEmail(
      testEmail,
      '🧪 QuickSnack Resend Test',
      generateOTPEmail('123456', 'Test')
    );
    
    if (result.success) {
      console.log('\n✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log('\n📊 Check your inbox and Resend dashboard:');
      console.log('   https://resend.com/emails');
    } else {
      console.error('\n❌ Email sending failed:');
      console.error(`   Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
  
  console.log('\n✅ Resend API test completed successfully!\n');
}

// Run the test
testResendEmail();
