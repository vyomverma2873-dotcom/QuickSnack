const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Snacks and Munchies',
      'Cold Drinks',
      'Paan Corner',
      'Sweet Tooth'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen']
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  brand: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validFrom: Date,
    validTo: Date
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  seoTitle: String,
  seoDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, inStock: 1 });
productSchema.index({ slug: 1 });

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount.percentage > 0) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Check if discount is active
productSchema.virtual('isDiscountActive').get(function() {
  const now = new Date();
  return this.discount.percentage > 0 && 
         (!this.discount.validFrom || this.discount.validFrom <= now) &&
         (!this.discount.validTo || this.discount.validTo >= now);
});

module.exports = mongoose.model('Product', productSchema);
