const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products - Get all active products (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, featured } = req.query;
    
    const query = {
      isActive: true,
      inStock: true
    };
    
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

    let sortCriteria = { createdAt: -1 };
    
    // If featured products requested, sort by rating
    if (featured === 'true') {
      sortCriteria = { 'ratings.average': -1, createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortCriteria)
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
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/products/:id - Get single product (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({
      _id: id,
      isActive: true
    }).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/products/category/:category - Get products by category (public endpoint)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const query = {
      category: category,
      isActive: true,
      inStock: true
    };

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
    console.error('Category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
