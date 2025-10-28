const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Fresh Bananas",
    description: "Sweet and ripe bananas, perfect for snacking or smoothies. Rich in potassium and natural sugars.",
    price: 40,
    originalPrice: 50,
    category: "Fruits & Vegetables",
    subcategory: "Fresh Fruits",
    unit: "dozen",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
        alt: "Fresh ripe bananas",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 150,
    isActive: true,
    tags: ["fresh", "organic", "healthy", "potassium"],
    brand: "Farm Fresh",
    discount: {
      percentage: 20,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    nutritionalInfo: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12.2
    }
  },
  {
    name: "Whole Milk",
    description: "Fresh full-fat milk from local dairy farms. Rich in calcium and protein for strong bones.",
    price: 60,
    category: "Dairy & Eggs",
    subcategory: "Milk",
    unit: "l",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
        alt: "Fresh whole milk bottle",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 80,
    isActive: true,
    tags: ["dairy", "calcium", "protein", "fresh"],
    brand: "Pure Dairy",
    nutritionalInfo: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0,
      sugar: 12
    }
  },
  {
    name: "Brown Bread",
    description: "Freshly baked whole wheat brown bread. High in fiber and perfect for healthy sandwiches.",
    price: 35,
    category: "Bakery",
    subcategory: "Bread",
    unit: "piece",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
        alt: "Fresh brown bread loaf",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 45,
    isActive: true,
    tags: ["whole wheat", "fiber", "healthy", "fresh baked"],
    brand: "Baker's Choice",
    nutritionalInfo: {
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      fiber: 3,
      sugar: 2
    }
  },
  {
    name: "Basmati Rice",
    description: "Premium quality aged basmati rice. Long grain, aromatic, and perfect for biryanis and pulao.",
    price: 180,
    category: "Pantry Staples",
    subcategory: "Rice & Grains",
    unit: "kg",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        alt: "Premium basmati rice",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 200,
    isActive: true,
    tags: ["basmati", "premium", "aromatic", "long grain"],
    brand: "Royal Grain",
    nutritionalInfo: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0.1
    }
  },
  {
    name: "Fresh Chicken Breast",
    description: "Premium quality fresh chicken breast. Lean protein, perfect for grilling, roasting, or curry.",
    price: 320,
    category: "Meat & Seafood",
    subcategory: "Chicken",
    unit: "kg",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
        alt: "Fresh chicken breast",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 25,
    isActive: true,
    tags: ["fresh", "protein", "lean", "premium"],
    brand: "Farm Fresh Poultry",
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0
    }
  },
  {
    name: "Potato Chips - Classic Salted",
    description: "Crispy and crunchy potato chips with the perfect amount of salt. Great for snacking anytime.",
    price: 25,
    category: "Snacks & Beverages",
    subcategory: "Chips & Snacks",
    unit: "pack",
    quantity: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
        alt: "Classic salted potato chips",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 120,
    isActive: true,
    tags: ["crispy", "salty", "snack", "crunchy"],
    brand: "Crispy Bites",
    nutritionalInfo: {
      calories: 150,
      protein: 2,
      carbs: 15,
      fat: 10,
      fiber: 1,
      sugar: 0.5
    }
  },
  {
    name: "Frozen Green Peas",
    description: "Fresh frozen green peas. Retains all nutrients and flavor. Perfect for curries and rice dishes.",
    price: 45,
    category: "Frozen Foods",
    subcategory: "Frozen Vegetables",
    unit: "pack",
    quantity: 500, // 500g pack
    images: [
      {
        url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
        alt: "Frozen green peas",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 60,
    isActive: true,
    tags: ["frozen", "vegetables", "nutritious", "convenient"],
    brand: "Freeze Fresh",
    nutritionalInfo: {
      calories: 81,
      protein: 5.4,
      carbs: 14.5,
      fat: 0.4,
      fiber: 5.7,
      sugar: 5.7
    }
  },
  {
    name: "Hand Sanitizer",
    description: "70% alcohol-based hand sanitizer. Kills 99.9% of germs and bacteria. Essential for daily hygiene.",
    price: 85,
    category: "Personal Care",
    subcategory: "Hygiene",
    unit: "ml",
    quantity: 250,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400",
        alt: "Hand sanitizer bottle",
        isPrimary: true
      }
    ],
    inStock: true,
    stockCount: 75,
    isActive: true,
    tags: ["sanitizer", "hygiene", "antibacterial", "essential"],
    brand: "SafeGuard",
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    }
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} sample products`);

    console.log('Sample products:');
    products.forEach(product => {
      console.log(`- ${product.name} (₹${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
