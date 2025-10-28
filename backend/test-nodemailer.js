#!/usr/bin/env node

/**
 * Quick test script to verify Nodemailer is working
 * Run: node test-nodemailer.js
 */

require('dotenv').config();
const { sendEmail, generateOTPEmail } = require('./services/emailService');

async function testNodemailerEmail() {
  console.log('\n🧪 Testing Nodemailer Email Service...\n');
  
  // Check if credentials are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS is not set in environment variables');
    process.exit(1);
  }
  
  console.log('✅ Email credentials found');
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT || '587'}`);
  console.log(`   EMAIL_PASS: ${'*'.repeat(process.env.EMAIL_PASS.length)} (hidden)`);
  
  // Test email address - you can change this
  const testEmail = process.env.EMAIL_USER; // Send to self first
  console.log(`\n📧 Sending test email to: ${testEmail}`);
  console.log('   (You can test with any email address!)\n');
  
  try {
    const result = await sendEmail(
      testEmail,
      '🧪 QuickSnack Nodemailer Test',
      generateOTPEmail('123456', 'Test')
    );
    
    if (result.success) {
      console.log('\n✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`\n📬 Check your inbox: ${testEmail}`);
      console.log('   (Also check spam folder if not in inbox)\n');
      console.log('🎉 Nodemailer is working perfectly!');
      console.log('   You can now send emails to ANY email address!\n');
    } else {
      console.error('\n❌ Email sending failed:');
      console.error(`   Error: ${result.error}`);
      console.error('\n🔍 Troubleshooting:');
      console.error('   1. Check if 2FA is enabled on Gmail');
      console.error('   2. Verify app password is correct (no spaces)');
      console.error('   3. Check SMTP settings');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(`   ${error.message}`);
    console.error('\n🔍 Full error:', error);
    process.exit(1);
  }
}

// Run the test
console.log('═'.repeat(60));
console.log('  QuickSnack Nodemailer Test');
console.log('═'.repeat(60));

testNodemailerEmail();
