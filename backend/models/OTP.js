const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otpHash: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'orderVerification', 'reset-password'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  }
}, {
  timestamps: true
});

// TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash OTP before saving
otpSchema.pre('save', async function(next) {
  if (!this.isModified('otpHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.otpHash = await bcrypt.hash(this.otpHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare OTP method
otpSchema.methods.compareOTP = async function(candidateOTP) {
  return bcrypt.compare(candidateOTP, this.otpHash);
};

// Check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('OTP', otpSchema);
