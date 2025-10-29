const express = require('express');
const { sendEmail, generateOTPEmail } = require('../services/emailService');

const router = express.Router();

// Debug endpoint to test email sending
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('Testing Brevo email configuration...');
    console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL);
    console.log('BREVO_API_KEY set:', process.env.BREVO_API_KEY ? 'Yes' : 'No');
    console.log('BREVO_API_KEY length:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 'not set');

    const result = await sendEmail(
      email,
      'QuickSnack Email Test',
      generateOTPEmail('123456', 'Test')
    );

    res.json({
      success: true,
      message: 'Email test completed',
      emailResult: result
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

module.exports = router;
