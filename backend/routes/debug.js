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

    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'not set');

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
