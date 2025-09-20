import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Plus, Clock, Grid, List, ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  deliveryTime: string;
  inStock: boolean;
  discount?: number;
  description?: string;
}

// Comprehensive product list
const allProducts: Product[] = [
  // Fruits
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 49,
    originalPrice: 65,
    rating: 4.5,
    reviews: 128,
    image: '🍌',
    category: 'Fruits',
    deliveryTime: '10 mins',
    inStock: true,
    discount: 25,
    description: 'Fresh, ripe bananas perfect for smoothies and snacking'
  },
  {
    id: '2',
    name: 'Red Apples',
    price: 120,
    rating: 4.3,
    reviews: 89,
    image: '🍎',
    category: 'Fruits',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Crisp and sweet red apples, rich in vitamins'
  },
  {
    id: '3',
    name: 'Fresh Oranges',
    price: 80,
    rating: 4.4,
    reviews: 156,
    image: '🍊',
    category: 'Fruits',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Juicy oranges packed with vitamin C'
  },
  {
    id: '4',
    name: 'Green Grapes',
    price: 150,
    rating: 4.6,
    reviews: 203,
    image: '🍇',
    category: 'Fruits',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Sweet and seedless green grapes'
  },
  {
    id: '5',
    name: 'Fresh Strawberries',
    price: 200,
    rating: 4.8,
    reviews: 145,
    image: '🍓',
    category: 'Fruits',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium fresh strawberries, perfect for desserts'
  },

  // Vegetables
  {
    id: '6',
    name: 'Fresh Tomatoes',
    price: 60,
    rating: 4.2,
    reviews: 234,
    image: '🍅',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Farm-fresh tomatoes, ideal for cooking'
  },
  {
    id: '7',
    name: 'Green Cucumbers',
    price: 40,
    rating: 4.1,
    reviews: 167,
    image: '🥒',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Crisp cucumbers perfect for salads'
  },
  {
    id: '8',
    name: 'Fresh Carrots',
    price: 55,
    rating: 4.3,
    reviews: 189,
    image: '🥕',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Sweet and crunchy carrots, rich in beta-carotene'
  },
  {
    id: '9',
    name: 'Green Broccoli',
    price: 70,
    rating: 4.0,
    reviews: 98,
    image: '🥦',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Fresh broccoli florets, packed with nutrients'
  },
  {
    id: '10',
    name: 'Fresh Spinach',
    price: 45,
    rating: 4.2,
    reviews: 156,
    image: '🥬',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Tender spinach leaves, perfect for salads and cooking'
  },

  // Dairy
  {
    id: '11',
    name: 'Organic Milk 1L',
    price: 85,
    rating: 4.8,
    reviews: 256,
    image: '🥛',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: true,
    description: 'Fresh organic milk from grass-fed cows'
  },
  {
    id: '12',
    name: 'Greek Yogurt',
    price: 120,
    rating: 4.7,
    reviews: 189,
    image: '🍶',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: true,
    description: 'Creamy Greek yogurt, high in protein'
  },
  {
    id: '13',
    name: 'Fresh Cheese',
    price: 180,
    rating: 4.5,
    reviews: 134,
    image: '🧀',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: true,
    description: 'Artisanal fresh cheese, perfect for sandwiches'
  },
  {
    id: '14',
    name: 'Farm Eggs (12 pcs)',
    price: 90,
    rating: 4.6,
    reviews: 298,
    image: '🥚',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: true,
    description: 'Fresh farm eggs from free-range chickens'
  },

  // Bakery
  {
    id: '15',
    name: 'Whole Wheat Bread',
    price: 45,
    rating: 4.4,
    reviews: 167,
    image: '🍞',
    category: 'Bakery',
    deliveryTime: '12 mins',
    inStock: true,
    description: 'Freshly baked whole wheat bread'
  },
  {
    id: '16',
    name: 'Croissants (4 pcs)',
    price: 120,
    rating: 4.7,
    reviews: 89,
    image: '🥐',
    category: 'Bakery',
    deliveryTime: '12 mins',
    inStock: true,
    description: 'Buttery, flaky croissants baked fresh daily'
  },
  {
    id: '17',
    name: 'Chocolate Muffins',
    price: 80,
    rating: 4.5,
    reviews: 145,
    image: '🧁',
    category: 'Bakery',
    deliveryTime: '12 mins',
    inStock: true,
    description: 'Delicious chocolate chip muffins'
  },

  // Snacks
  {
    id: '18',
    name: 'Mixed Nuts',
    price: 250,
    rating: 4.6,
    reviews: 234,
    image: '🥜',
    category: 'Snacks',
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Premium mixed nuts, perfect for healthy snacking'
  },
  {
    id: '19',
    name: 'Potato Chips',
    price: 60,
    rating: 4.2,
    reviews: 189,
    image: '🍟',
    category: 'Snacks',
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Crispy potato chips with sea salt'
  },
  {
    id: '20',
    name: 'Dark Chocolate Bar',
    price: 150,
    rating: 4.8,
    reviews: 167,
    image: '🍫',
    category: 'Snacks',
    deliveryTime: '15 mins',
    inStock: true,
    description: '70% dark chocolate bar, rich and indulgent'
  },

  // Beverages
  {
    id: '21',
    name: 'Fresh Orange Juice',
    price: 80,
    rating: 4.2,
    reviews: 98,
    image: '🧃',
    category: 'Beverages',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Freshly squeezed orange juice, no preservatives'
  },
  {
    id: '22',
    name: 'Green Tea',
    price: 120,
    rating: 4.4,
    reviews: 156,
    image: '🍵',
    category: 'Beverages',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium green tea leaves, antioxidant-rich'
  },
  {
    id: '23',
    name: 'Coconut Water',
    price: 70,
    rating: 4.3,
    reviews: 123,
    image: '🥥',
    category: 'Beverages',
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Natural coconut water, refreshing and hydrating'
  }
];

const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Beverages'];

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category as string || 'All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (category && typeof category === 'string') {
      setSelectedCategory(category);
    }
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = async (product: Product) => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    setAddingToCart(product.id);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
      
      toast.success(`${product.name} added to cart!`);
      
      // Dispatch events to update navbar cart count
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setTimeout(() => setAddingToCart(null), 500);
    }
  };

  return (
    <>
      <Head>
        <title>All Products - QuickSnack</title>
        <meta name="description" content="Browse all products available on QuickSnack - fresh groceries delivered fast" />
      </Head>

      <Layout>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                All Products
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Fresh groceries, snacks, and daily essentials delivered to your doorstep
              </p>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-white/10"
            >
              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-800/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort and View Options */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Filter className="w-5 h-5 text-blue-400" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-gray-800/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white backdrop-blur-sm"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="p-8 bg-gray-800/50 rounded-2xl mb-6 inline-block">
                    <ShoppingCart className="w-20 h-20 text-gray-500 mx-auto mb-4" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">No products found</h3>
                  <p className="text-gray-400 text-lg">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-white/10 hover:border-white/20 ${
                        viewMode === 'list' ? 'flex items-center p-8' : 'p-8'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-32 mr-8' : 'w-full h-56'} bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500`}>
                        <span className="text-7xl">{product.image}</span>
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        {/* Product Info */}
                        <div className={`${viewMode === 'list' ? 'flex justify-between items-start' : ''} mb-6`}>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="text-sm font-bold text-white ml-2">{product.rating}</span>
                              </div>
                              <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-2 text-emerald-400">
                                <Clock className="w-4 h-4" />
                                <span>{product.deliveryTime}</span>
                              </div>
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          {viewMode === 'list' && (
                            <div className="text-right">
                              <div className="flex items-center space-x-3 mb-3">
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                )}
                                <span className="text-3xl font-bold text-white">₹{product.price}</span>
                              </div>
                              {product.discount && (
                                <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                                  {product.discount}% OFF
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price and Add to Cart */}
                        <div className={`${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}>
                          {viewMode === 'grid' && (
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center space-x-3">
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                )}
                                <span className="text-3xl font-bold text-white">₹{product.price}</span>
                              </div>
                              {product.discount && (
                                <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                                  {product.discount}% OFF
                                </span>
                              )}
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                            whileTap={{ scale: product.inStock ? 0.98 : 1 }}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock || addingToCart === product.id}
                            className={`${viewMode === 'list' ? 'px-8 py-3' : 'w-full py-4'} flex items-center justify-center space-x-2 rounded-xl font-bold transition-all duration-300 ${
                              product.inStock
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:scale-105'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {addingToCart === product.id ? (
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus className="w-6 h-6" />
                                <span className="text-lg">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Results Summary */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mt-12 text-gray-600"
              >
                Showing {filteredProducts.length} of {allProducts.length} products
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductsPage;
