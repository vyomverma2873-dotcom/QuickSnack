const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail, generateOTPEmail, generateWelcomeEmail } = require('../services/emailService');

const router = express.Router();

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes (reduced from 15)
  max: 10, // limit each IP to 10 OTP requests per windowMs (increased from 5)
  message: { success: false, message: 'Too many OTP requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });
    
    // Create new OTP record
    const otpRecord = new OTP({
      email: email.toLowerCase(),
      otpHash: otp, // Will be hashed by pre-save middleware
      purpose: 'signup'
    });
    await otpRecord.save();

    // Send OTP email
    await sendEmail(
      email,
      'Your QuickSnack OTP',
      generateOTPEmail(otp)
    );

    // Store user data temporarily (without saving to users collection yet)
    res.json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete signup.',
      tempData: { name, email, phone, password }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, userData } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      purpose: 'signup'
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const isValidOTP = await otpRecord.compareOTP(otp);
    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Create user account
    const user = new User({
      name: userData.name,
      email: email.toLowerCase(),
      phone: userData.phone,
      passwordHash: userData.password || undefined,
      isVerified: true
    });

    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send welcome email
    await sendEmail(
      email,
      'Welcome to QuickSnack — Thanks for joining!',
      generateWelcomeEmail(userData.name)
    );

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, useOTP } = req.body;
    console.log(`🔐 Login attempt for email: ${email}, useOTP: ${useOTP}, hasPassword: ${!!password}`);

    if (!email) {
      console.log('❌ Email is required');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(`👤 User found: ${!!user}, isVerified: ${user?.isVerified}, hasPasswordHash: ${!!user?.passwordHash}`);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({
        success: false,
        message: 'User not found with this email'
      });
    }
    
    if (!user.isVerified) {
      console.log('❌ User not verified');
      return res.status(400).json({
        success: false,
        message: 'Account not verified. Please complete verification.'
      });
    }

    if (useOTP) {
      // OTP-based login
      const otp = generateOTP();
      
      // Delete any existing OTPs for this email
      await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'login' });
      
      // Create new OTP record
      const otpRecord = new OTP({
        email: email.toLowerCase(),
        otpHash: otp,
        purpose: 'login'
      });
      await otpRecord.save();

      // Send OTP email
      await sendEmail(
        email,
        'Your QuickSnack OTP',
        generateOTPEmail(otp)
      );

      res.json({
        success: true,
        message: 'OTP sent to your email',
        requiresOTP: true
      });
    } else {
      // Password-based login
      if (!password) {
        console.log('❌ Password is required');
        return res.status(400).json({
          success: false,
          message: 'Password is required'
        });
      }

      console.log('🔍 Comparing password...');
      try {
        const isValidPassword = await user.comparePassword(password);
        console.log(`🔐 Password valid: ${isValidPassword}`);
        
        if (!isValidPassword) {
          console.log('❌ Invalid credentials');
          return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
      } catch (passwordError) {
        console.error('Password comparison error:', passwordError);
        return res.status(400).json({
          success: false,
          message: 'Login failed. Please try again.'
        });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
          isVerified: user.isVerified
        }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    console.error('Login error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/verify-login-otp
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`🔐 Verifying login OTP for email: ${email}, OTP: ${otp}`);

    if (!email || !otp) {
      console.log('❌ Missing email or OTP');
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      purpose: 'login'
    });
    console.log(`🔍 OTP record found: ${otpRecord ? 'Yes' : 'No'}`);

    if (!otpRecord) {
      console.log('❌ OTP not found or expired');
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      console.log('❌ OTP has expired');
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    console.log(`🔐 Comparing OTP: provided=${otp}, stored=${otpRecord.otpHash}`);
    const isValidOTP = await otpRecord.compareOTP(otp);
    console.log(`✅ OTP valid: ${isValidOTP}`);
    
    if (!isValidOTP) {
      console.log('❌ Invalid OTP provided');
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User not found or not verified'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'reset-password' });
    
    // Create new OTP record
    const otpRecord = new OTP({
      email: email.toLowerCase(),
      otpHash: otp,
      purpose: 'reset-password'
    });
    await otpRecord.save();

    // Send OTP email
    await sendEmail(
      email,
      'Reset Your QuickSnack Password',
      generateOTPEmail(otp, 'Password Reset')
    );

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/verify-reset-otp
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      purpose: 'reset-password'
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const isValidOTP = await otpRecord.compareOTP(otp);
    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid - don't delete it yet, we'll need it for password reset
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      purpose: 'reset-password'
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const isValidOTP = await otpRecord.compareOTP(otp);
    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find user and update password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send confirmation email
    await sendEmail(
      email,
      'Password Reset Successful',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Password Reset Successful</h2>
        <p>Hello ${user.name},</p>
        <p>Your password has been successfully reset. You can now log in with your new password.</p>
        <p>If you didn't request this password reset, please contact our support team immediately.</p>
        <p>Best regards,<br>The QuickSnack Team</p>
      </div>
      `
    );

    res.json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
