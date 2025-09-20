// Centralized products database for search functionality
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryId: string;
  rating: number;
  reviews?: number;
  deliveryTime?: string;
  inStock: boolean;
  discount?: number;
  description: string;
}

// All products from all categories
export const allProducts: Product[] = [
  // Fruits (5 products)
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 49,
    originalPrice: 65,
    image: '🍌',
    category: 'Fruits',
    categoryId: 'fruits',
    rating: 4.5,
    reviews: 128,
    deliveryTime: '10 mins',
    inStock: true,
    discount: 25,
    description: 'Fresh, ripe bananas perfect for smoothies and snacking'
  },
  {
    id: '2',
    name: 'Red Apples',
    price: 120,
    image: '🍎',
    category: 'Fruits',
    categoryId: 'fruits',
    rating: 4.3,
    reviews: 89,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Crisp and sweet red apples, rich in vitamins'
  },
  {
    id: '3',
    name: 'Fresh Oranges',
    price: 80,
    image: '🍊',
    category: 'Fruits',
    categoryId: 'fruits',
    rating: 4.4,
    reviews: 156,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Juicy oranges packed with vitamin C'
  },
  {
    id: '4',
    name: 'Green Grapes',
    price: 150,
    image: '🍇',
    category: 'Fruits',
    categoryId: 'fruits',
    rating: 4.6,
    reviews: 203,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Sweet and seedless green grapes'
  },
  {
    id: '5',
    name: 'Fresh Strawberries',
    price: 200,
    image: '🍓',
    category: 'Fruits',
    categoryId: 'fruits',
    rating: 4.8,
    reviews: 145,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium fresh strawberries, perfect for desserts'
  },

  // Vegetables (5 products)
  {
    id: '6',
    name: 'Fresh Tomatoes',
    price: 60,
    image: '🍅',
    category: 'Vegetables',
    categoryId: 'vegetables',
    rating: 4.2,
    reviews: 95,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh, juicy tomatoes perfect for cooking'
  },
  {
    id: '7',
    name: 'Green Cucumbers',
    price: 40,
    image: '🥒',
    category: 'Vegetables',
    categoryId: 'vegetables',
    rating: 4.1,
    reviews: 67,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Crisp and fresh cucumbers for salads'
  },
  {
    id: '8',
    name: 'Fresh Carrots',
    price: 55,
    image: '🥕',
    category: 'Vegetables',
    categoryId: 'vegetables',
    rating: 4.3,
    reviews: 82,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Sweet and crunchy carrots, rich in beta-carotene'
  },
  {
    id: '9',
    name: 'Green Broccoli',
    price: 70,
    image: '🥦',
    category: 'Vegetables',
    categoryId: 'vegetables',
    rating: 4.0,
    reviews: 54,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh broccoli florets, packed with nutrients'
  },
  {
    id: '10',
    name: 'Fresh Spinach',
    price: 45,
    image: '🥬',
    category: 'Vegetables',
    categoryId: 'vegetables',
    rating: 4.4,
    reviews: 73,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh spinach leaves, perfect for salads and cooking'
  },

  // Dairy (4 products)
  {
    id: '11',
    name: 'Organic Milk 1L',
    price: 85,
    image: '🥛',
    category: 'Dairy',
    categoryId: 'dairy',
    rating: 4.8,
    reviews: 234,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh organic milk, rich in calcium and protein'
  },
  {
    id: '12',
    name: 'Greek Yogurt',
    price: 120,
    image: '🍶',
    category: 'Dairy',
    categoryId: 'dairy',
    rating: 4.7,
    reviews: 189,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Creamy Greek yogurt with probiotics'
  },
  {
    id: '13',
    name: 'Fresh Cheese',
    price: 180,
    image: '🧀',
    category: 'Dairy',
    categoryId: 'dairy',
    rating: 4.5,
    reviews: 156,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium fresh cheese for cooking and snacking'
  },
  {
    id: '14',
    name: 'Farm Eggs (12 pcs)',
    price: 90,
    image: '🥚',
    category: 'Dairy',
    categoryId: 'dairy',
    rating: 4.6,
    reviews: 278,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh farm eggs, perfect for breakfast and baking'
  },

  // Snacks (3 products)
  {
    id: '18',
    name: 'Mixed Nuts',
    price: 250,
    image: '🥜',
    category: 'Snacks',
    categoryId: 'snacks',
    rating: 4.6,
    reviews: 167,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium mixed nuts, perfect for healthy snacking'
  },
  {
    id: '19',
    name: 'Potato Chips',
    price: 60,
    image: '🍟',
    category: 'Snacks',
    categoryId: 'snacks',
    rating: 4.3,
    reviews: 245,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Crispy potato chips with sea salt'
  },
  {
    id: '20',
    name: 'Dark Chocolate Bar',
    price: 150,
    image: '🍫',
    category: 'Snacks',
    categoryId: 'snacks',
    rating: 4.8,
    reviews: 198,
    deliveryTime: '10 mins',
    inStock: true,
    description: '70% dark chocolate bar, rich and indulgent'
  },

  // Beverages (3 products)
  {
    id: '21',
    name: 'Fresh Orange Juice',
    price: 80,
    image: '🧃',
    category: 'Beverages',
    categoryId: 'beverages',
    rating: 4.5,
    reviews: 134,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Freshly squeezed orange juice, no added sugar'
  },
  {
    id: '22',
    name: 'Green Tea',
    price: 120,
    image: '🍵',
    category: 'Beverages',
    categoryId: 'beverages',
    rating: 4.4,
    reviews: 89,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium green tea leaves, rich in antioxidants'
  },
  {
    id: '23',
    name: 'Coconut Water',
    price: 70,
    image: '🥥',
    category: 'Beverages',
    categoryId: 'beverages',
    rating: 4.2,
    reviews: 76,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Natural coconut water, refreshing and hydrating'
  },

  // Ready to Eat (6 products)
  {
    id: 'ready-1',
    name: 'Sandwich (Turkey & Cheese)',
    price: 199,
    image: '🥪',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.3,
    reviews: 87,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Fresh turkey and cheese sandwich with lettuce and tomato'
  },
  {
    id: 'ready-2',
    name: 'Caesar Salad',
    price: 249,
    image: '🥗',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.5,
    reviews: 112,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Fresh Caesar salad with croutons and parmesan'
  },
  {
    id: 'ready-3',
    name: 'Sushi Roll',
    price: 399,
    image: '🍣',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.7,
    reviews: 156,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Fresh sushi roll with salmon and avocado'
  },
  {
    id: 'ready-4',
    name: 'Chicken Wrap',
    price: 179,
    image: '🌯',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.4,
    reviews: 93,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Grilled chicken wrap with fresh vegetables'
  },
  {
    id: 'ready-5',
    name: 'Pizza Slice',
    price: 129,
    image: '🍕',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.2,
    reviews: 178,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Fresh pizza slice with cheese and pepperoni'
  },
  {
    id: 'ready-6',
    name: 'Fruit Cup',
    price: 99,
    image: '🍇',
    category: 'Ready to Eat',
    categoryId: 'ready-to-eat',
    rating: 4.6,
    reviews: 67,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Mixed fresh fruit cup with seasonal fruits'
  },

  // Meat & Fish (6 products)
  {
    id: 'meat-1',
    name: 'Fresh Salmon Fillet',
    price: 499,
    image: '🐟',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.8,
    reviews: 145,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Premium fresh salmon fillet, rich in omega-3'
  },
  {
    id: 'meat-2',
    name: 'Chicken Breast',
    price: 299,
    image: '🍗',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.5,
    reviews: 234,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Fresh chicken breast, perfect for grilling'
  },
  {
    id: 'meat-3',
    name: 'Ground Beef',
    price: 399,
    image: '🥩',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.4,
    reviews: 189,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Fresh ground beef, ideal for burgers and cooking'
  },
  {
    id: 'meat-4',
    name: 'Pork Chops',
    price: 349,
    image: '🥩',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.3,
    reviews: 98,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Tender pork chops, perfect for grilling'
  },
  {
    id: 'meat-5',
    name: 'Shrimp (Large)',
    price: 599,
    image: '🦐',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.7,
    reviews: 167,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Fresh large shrimp, perfect for seafood dishes'
  },
  {
    id: 'meat-6',
    name: 'Turkey Slices',
    price: 249,
    image: '🦃',
    category: 'Meat & Fish',
    categoryId: 'meat',
    rating: 4.2,
    reviews: 76,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Sliced turkey breast, perfect for sandwiches'
  },

  // Instant Food (8 products)
  {
    id: 'instant-1',
    name: 'Instant Ramen Noodles',
    price: 49,
    image: '🍜',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.1,
    reviews: 345,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Quick and tasty instant ramen noodles'
  },
  {
    id: 'instant-2',
    name: 'Instant Oatmeal',
    price: 129,
    image: '🥣',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.4,
    reviews: 198,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Healthy instant oatmeal with fruits and nuts'
  },
  {
    id: 'instant-3',
    name: 'Instant Mac & Cheese',
    price: 79,
    image: '🧀',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.2,
    reviews: 267,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Creamy instant mac and cheese'
  },
  {
    id: 'instant-4',
    name: 'Instant Soup Mix',
    price: 99,
    image: '🍲',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.3,
    reviews: 156,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Hearty instant soup mix with vegetables'
  },
  {
    id: 'instant-5',
    name: 'Instant Coffee',
    price: 199,
    image: '☕',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.5,
    reviews: 289,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Premium instant coffee for quick energy boost'
  },
  {
    id: 'instant-6',
    name: 'Instant Rice',
    price: 89,
    image: '🍚',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.0,
    reviews: 134,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Quick-cooking instant rice, ready in minutes'
  },
  {
    id: 'instant-7',
    name: 'Instant Pancake Mix',
    price: 119,
    image: '🥞',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 4.6,
    reviews: 178,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Fluffy instant pancake mix, just add water'
  },
  {
    id: 'instant-8',
    name: 'Instant Mashed Potatoes',
    price: 69,
    image: '🥔',
    category: 'Instant Food',
    categoryId: 'instant',
    rating: 3.9,
    reviews: 98,
    deliveryTime: '5 mins',
    inStock: true,
    description: 'Creamy instant mashed potatoes'
  },

  // Electronics (6 products)
  {
    id: 'elec-1',
    name: 'Wireless Earbuds',
    price: 1999,
    image: '🎧',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.5,
    reviews: 234,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Premium wireless earbuds with noise cancellation'
  },
  {
    id: 'elec-2',
    name: 'Smart Watch',
    price: 4999,
    image: '⌚',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.3,
    reviews: 189,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Feature-rich smartwatch with health tracking'
  },
  {
    id: 'elec-3',
    name: 'Bluetooth Speaker',
    price: 2499,
    image: '🔊',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.6,
    reviews: 156,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Portable Bluetooth speaker with rich sound'
  },
  {
    id: 'elec-4',
    name: 'Phone Charger',
    price: 799,
    image: '🔌',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.2,
    reviews: 345,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Fast charging USB-C phone charger'
  },
  {
    id: 'elec-5',
    name: 'Wireless Mouse',
    price: 1299,
    image: '🖱️',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.4,
    reviews: 123,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Ergonomic wireless mouse for productivity'
  },
  {
    id: 'elec-6',
    name: 'USB-C Hub',
    price: 1599,
    image: '🔗',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.1,
    reviews: 87,
    deliveryTime: '30 mins',
    inStock: true,
    description: 'Multi-port USB-C hub for connectivity'
  }
];

// Search functionality
export const searchProducts = (query: string, limit: number = 10): Product[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  // Filter products that match the search term
  const matchedProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
  
  // Sort by relevance (exact name matches first, then partial matches)
  const sortedResults = matchedProducts.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().startsWith(searchTerm);
    const bNameMatch = b.name.toLowerCase().startsWith(searchTerm);
    
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;
    
    // If both or neither start with search term, sort by rating
    return b.rating - a.rating;
  });
  
  return sortedResults.slice(0, limit);
};

// Get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return allProducts.filter(product => product.categoryId === categoryId);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(product => product.id === id);
};

// Get featured products (highest rated)
export const getFeaturedProducts = (limit: number = 8): Product[] => {
  return [...allProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
