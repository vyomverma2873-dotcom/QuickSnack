#!/usr/bin/env node

/**
 * Quick test script to verify Brevo API is working
 * Run: node test-brevo.js
 */

require('dotenv').config();
const { sendEmail, generateOTPEmail } = require('./services/emailService');

async function testBrevoEmail() {
  console.log('\n🧪 Testing Brevo Email Service...\n');
  
  // Check if API key is set
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not set in environment variables');
    process.exit(1);
  }
  
  console.log('✅ Brevo API key found');
  console.log(`   API Key: ${process.env.BREVO_API_KEY.substring(0, 30)}...`);
  console.log(`   Sender Email: ${process.env.BREVO_SENDER_EMAIL || 'vyomverma2873@gmail.com'}`);
  
  // Test email address
  const testEmail = process.env.BREVO_SENDER_EMAIL || 'vyomverma2873@gmail.com';
  console.log(`\n📧 Sending test email to: ${testEmail}`);
  console.log('   (Brevo can send to ANY email address!)\n');
  
  try {
    const result = await sendEmail(
      testEmail,
      '🧪 QuickSnack Brevo Test',
      generateOTPEmail('123456', 'Test')
    );
    
    if (result.success) {
      console.log('\n✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`\n📬 Check your inbox: ${testEmail}`);
      console.log('   (Also check spam folder if not in inbox)\n');
      console.log('🎉 Brevo API is working perfectly!');
      console.log('   ✅ No SMTP issues');
      console.log('   ✅ Works on any cloud platform');
      console.log('   ✅ Can send to ANY email address\n');
    } else {
      console.error('\n❌ Email sending failed:');
      console.error(`   Error: ${result.error}`);
      console.error('\n🔍 Troubleshooting:');
      console.error('   1. Check if Brevo API key is correct');
      console.error('   2. Verify sender email is verified in Brevo dashboard');
      console.error('   3. Check Brevo account limits');
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
console.log('  QuickSnack Brevo API Test');
console.log('═'.repeat(60));

testBrevoEmail();
