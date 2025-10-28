const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function clearProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Count existing products
    const count = await Product.countDocuments();
    console.log(`Found ${count} products in database`);

    if (count === 0) {
      console.log('No products to remove');
      process.exit(0);
    }

    // Clear all products
    const result = await Product.deleteMany({});
    console.log(`✅ Successfully removed ${result.deletedCount} products from the database`);

    console.log('🎉 All dummy products have been cleared!');
    console.log('Your product catalog is now empty and ready for real products.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
}

clearProducts();
