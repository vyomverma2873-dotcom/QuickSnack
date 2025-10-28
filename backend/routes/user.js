const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/user/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        addresses: req.user.addresses,
        isVerified: req.user.isVerified,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/user/me - Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/user/addresses - Add new address
router.post('/addresses', auth, async (req, res) => {
  try {
    const { label, address, city, state, pincode, lat, lng, isDefault } = req.body;

    if (!label || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All address fields are required'
      });
    }

    const user = await User.findById(req.user._id);

    // If this is the first address or marked as default, set it as default
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      address,
      city,
      state,
      pincode,
      lat: lat || null,
      lng: lng || null,
      isDefault: shouldBeDefault
    });

    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/user/addresses/:addressId - Update address
router.put('/addresses/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, address, city, state, pincode, lat, lng, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update address fields
    if (label) user.addresses[addressIndex].label = label;
    if (address) user.addresses[addressIndex].address = address;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (pincode) user.addresses[addressIndex].pincode = pincode;
    if (lat !== undefined) user.addresses[addressIndex].lat = lat;
    if (lng !== undefined) user.addresses[addressIndex].lng = lng;

    // Handle default address
    if (isDefault) {
      user.addresses.forEach((addr, index) => {
        addr.isDefault = index === addressIndex;
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/user/addresses/:addressId - Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are other addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
