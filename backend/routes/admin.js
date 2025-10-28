const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail, generateOrderStatusEmail } = require('../services/emailService');

const router = express.Router();

// GET /api/admin/metrics - Get admin dashboard metrics
router.get('/metrics', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, pendingOrders, confirmedOrders, deliveredOrders] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'delivered' })
    ]);

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId amount status createdAt userId');

    // Get recent users
    const recentUsers = await User.find({ isVerified: true })
      .select('name email createdAt isVerified')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingOrders,
        recentOrders,
        recentUsers
      }
    });

  } catch (error) {
    console.error('Admin metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/orders - Get all orders with pagination
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    // Search by order ID or user email
    if (search) {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } }
      ];
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/orders/:orderId/status - Update order status
router.put('/orders/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Try to find by orderId first, then by _id if it's a valid ObjectId
    let query = { orderId };
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      query = { $or: [{ orderId }, { _id: orderId }] };
    }

    const order = await Order.findOneAndUpdate(
      query,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Send email notification for status changes (except pending)
    if (status !== 'pending') {
      console.log(`🚀 Attempting to send ${status} email to ${order.userId.email} for order ${order.orderId}`);
      try {
        const emailHtml = generateOrderStatusEmail(
          order.userId.name,
          order.orderId,
          status,
          order.items,
          order.amount
        );

        if (emailHtml) {
          const subjectMap = {
            confirmed: `✅ Your QuickSnack Order #${order.orderId} is Confirmed!`,
            dispatched: `🚚 Your QuickSnack Order #${order.orderId} is On The Way!`,
            delivered: `✅ Your QuickSnack Order #${order.orderId} has been Delivered!`,
            cancelled: `❌ Your QuickSnack Order #${order.orderId} has been Cancelled`
          };

          const subject = subjectMap[status] || `📦 QuickSnack Order #${order.orderId} Status Update`;

          console.log(`📧 Sending email with subject: ${subject}`);
          await sendEmail(order.userId.email, subject, emailHtml);
          console.log(`✅ Status update email sent successfully to ${order.userId.email} for order ${order.orderId} - ${status}`);
        } else {
          console.log(`❌ No email HTML generated for status: ${status}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send status update email:', emailError);
        console.error('Email error details:', emailError.message);
        // Don't fail the status update if email fails
      }
    } else {
      console.log(`ℹ️ No email sent for status: ${status} (pending status doesn't trigger emails)`);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/users - Get all users with pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const query = { isVerified: true };
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/users/:userId/role - Update user role
router.put('/users/:userId/role', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/users/:userId/verification - Toggle user verification
router.put('/users/:userId/verification', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow deleting the admin user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.email === 'vyomverma2873@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    // Also delete all orders associated with this user
    await Order.deleteMany({ userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/products - Get all products with pagination
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, inStock } = req.query;
    
    const query = {};
    
    // Search by name, description, or tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by stock status
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/products/:productId - Update product
router.put('/products/:productId', adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/admin/products/:productId - Delete product
router.delete('/products/:productId', adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/admin/products/:productId/toggle-status - Toggle product active status
router.put('/products/:productId/toggle-status', adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product
    });

  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
