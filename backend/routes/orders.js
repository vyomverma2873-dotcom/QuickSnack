const express = require('express');
const { nanoid } = require('nanoid');
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail, generateOrderConfirmationEmail } = require('../services/emailService');

const router = express.Router();

// Generate unique order ID
const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = nanoid(6);
  return `QS-${dateStr}-${shortId}`;
};

// POST /api/orders - Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, amount, addressId, deliveryInstructions, paymentMethod, deliveryFee } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Get user with addresses
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find address
    let selectedAddress;
    if (addressId) {
      selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
    } else {
      selectedAddress = user.addresses.find(addr => addr.isDefault);
    }

    if (!selectedAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please select a delivery address'
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Calculate total amount including delivery fee
    const finalDeliveryFee = deliveryFee || (amount >= 299 ? 0 : 25);
    const totalAmount = amount + finalDeliveryFee;

    // Prepare payment method data
    const paymentMethodData = {
      type: paymentMethod?.type || 'cod',
      details: {}
    };

    // Set payment method specific details
    if (paymentMethodData.type === 'cod') {
      paymentMethodData.details.codAmount = totalAmount;
    } else if (paymentMethod?.details) {
      paymentMethodData.details = { ...paymentMethod.details };
    }

    // Create order
    const order = new Order({
      orderId,
      userId: req.user._id,
      items: items.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        qty: item.qty || item.quantity,
        price: item.price
      })),
      amount,
      deliveryFee: finalDeliveryFee,
      totalAmount,
      address: {
        label: selectedAddress.label,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng
      },
      paymentMethod: paymentMethodData,
      deliveryInstructions: deliveryInstructions || ''
    });

    await order.save();

    // Send confirmation email
    try {
      await sendEmail(
        user.email,
        `QuickSnack — Order confirmation (${orderId})`,
        generateOrderConfirmationEmail(user.name, orderId, order.items, totalAmount, order.address)
      );
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        orderId: order.orderId,
        items: order.items,
        amount: order.amount,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        address: order.address,
        deliveryInstructions: order.deliveryInstructions,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/orders - Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/orders/:orderId - Get specific order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      orderId, 
      userId: req.user._id 
    }).select('-__v');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/orders/:orderId/cancel - Cancel order
router.put('/:orderId/cancel', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      orderId, 
      userId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
