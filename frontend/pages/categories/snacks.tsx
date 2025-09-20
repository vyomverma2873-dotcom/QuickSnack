import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Candy, Filter } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

// Real snacks products matching our main products page
const snacksProducts = [
  {
    id: '18',
    name: 'Mixed Nuts',
    price: 250,
    image: '🥜',
    category: 'Snacks',
    rating: 4.6,
    reviews: 234,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Premium mixed nuts, perfect for healthy snacking'
  },
  {
    id: '19',
    name: 'Potato Chips',
    price: 60,
    image: '🍟',
    category: 'Snacks',
    rating: 4.2,
    reviews: 189,
    deliveryTime: '15 mins',
    inStock: true,
    description: 'Crispy potato chips with sea salt'
  },
  {
    id: '20',
    name: 'Dark Chocolate Bar',
    price: 150,
    image: '🍫',
    category: 'Snacks',
    rating: 4.8,
    reviews: 167,
    deliveryTime: '15 mins',
    inStock: true,
    description: '70% dark chocolate bar, rich and indulgent'
  }
];

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
];

const SnacksPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
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

  const sortProducts = (products: any[]) => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(snacksProducts);

  return (
    <>
      <Head>
        <title>Snacks & Munchies - QuickSnack</title>
        <meta 
          name="description" 
          content="Shop delicious snacks and munchies with fast delivery. Chips, cookies, nuts, candy and more at great prices." 
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-light-grayish-blue to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-peach to-mint-green text-white mb-6">
                <Candy className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-blue-gray mb-4">
                Snacks & Munchies
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Satisfy your cravings with our delicious snack selection
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mint-green focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-peach to-mint-green flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-6xl">{product.image}</span>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-blue-gray mb-2 group-hover:text-mint-green transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-slate-blue-gray">₹{product.price}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                      whileTap={{ scale: product.inStock ? 0.98 : 1 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || addingToCart === product.id}
                      className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        product.inStock
                          ? 'bg-mint-green text-slate-blue-gray hover:bg-opacity-90 hover:shadow-md'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {addingToCart === product.id ? (
                        <div className="w-5 h-5 border-2 border-slate-blue-gray border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>+</span>
                          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SnacksPage;
