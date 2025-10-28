const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    label: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['cod', 'online', 'upi', 'card'],
      required: true,
      default: 'cod'
    },
    details: {
      // For COD
      codAmount: Number,
      
      // For Online/Card payments
      transactionId: String,
      paymentGateway: String,
      
      // For UPI
      upiId: String,
      
      // Common fields
      paidAmount: Number,
      paymentDate: Date,
      paymentReference: String
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  deliveryInstructions: {
    type: String,
    trim: true,
    maxlength: 200
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
