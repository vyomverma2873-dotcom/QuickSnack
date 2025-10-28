const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('cart');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cart = user.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemCount = cart.reduce((count, item) => count + item.qty, 0);

    res.json({
      success: true,
      cart: {
        items: cart,
        total,
        itemCount
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, name, price, qty = 1 } = req.body;

    if (!productId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, name, and price are required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      user.cart[existingItemIndex].qty += qty;
    } else {
      // Add new item
      user.cart.push({
        productId,
        name,
        price,
        qty
      });
    }

    await user.save();

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemCount = user.cart.reduce((count, item) => count + item.qty, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: user.cart,
        total,
        itemCount
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || qty < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID and quantity are required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const itemIndex = user.cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      if (qty === 0) {
        // Remove item
        user.cart.splice(itemIndex, 1);
      } else {
        // Update quantity
        user.cart[itemIndex].qty = qty;
      }
    } else {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await user.save();

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemCount = user.cart.reduce((count, item) => count + item.qty, 0);

    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        items: user.cart,
        total,
        itemCount
      }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const itemIndex = user.cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      user.cart.splice(itemIndex, 1);
      await user.save();
    }

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemCount = user.cart.reduce((count, item) => count + item.qty, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: user.cart,
        total,
        itemCount
      }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/cart/sync - Sync local cart with server cart
router.post('/sync', auth, async (req, res) => {
  try {
    const { localCart } = req.body;

    if (!Array.isArray(localCart)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Merge local cart with server cart
    localCart.forEach(localItem => {
      const existingItemIndex = user.cart.findIndex(item => item.productId === localItem.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity (take the maximum)
        user.cart[existingItemIndex].qty = Math.max(
          user.cart[existingItemIndex].qty, 
          localItem.quantity
        );
      } else {
        // Add new item
        user.cart.push({
          productId: localItem.id,
          name: localItem.name,
          price: localItem.price,
          qty: localItem.quantity
        });
      }
    });

    await user.save();

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemCount = user.cart.reduce((count, item) => count + item.qty, 0);

    res.json({
      success: true,
      message: 'Cart synced successfully',
      cart: {
        items: user.cart,
        total,
        itemCount
      }
    });

  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
