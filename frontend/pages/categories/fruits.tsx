import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Apple, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

// Real fruits products matching our main products page
const fruitsProducts = [
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 49,
    originalPrice: 65,
    image: '🍌',
    category: 'Fruits',
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
    rating: 4.8,
    reviews: 145,
    deliveryTime: '10 mins',
    inStock: true,
    description: 'Premium fresh strawberries, perfect for desserts'
  }
];

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' }
];

const FruitsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const sortProducts = (products: any[]) => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(fruitsProducts);

  return (
    <>
      <Head>
        <title>Fresh Fruits - QuickSnack</title>
        <meta 
          name="description" 
          content="Shop fresh, organic fruits with fast delivery. Apples, bananas, berries and more at great prices." 
        />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mr-6 shadow-lg">
                <Apple className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white">Fresh Fruits</h1>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 bg-gray-800/50 border border-white/20 rounded-xl shadow-sm text-lg font-medium text-white hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <div className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Panel (Mobile) */}
          {showFilters && (
            <div className="bg-white p-4 rounded-md shadow-md mb-6 md:hidden">
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="price-1" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-1" className="ml-3 text-sm text-gray-600">Under $3</label>
                </div>
                <div className="flex items-center">
                  <input id="price-2" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-2" className="ml-3 text-sm text-gray-600">$3 to $5</label>
                </div>
                <div className="flex items-center">
                  <input id="price-3" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-3" className="ml-3 text-sm text-gray-600">$5 to $8</label>
                </div>
                <div className="flex items-center">
                  <input id="price-4" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-4" className="ml-3 text-sm text-gray-600">$8+</label>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative pb-[100%]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default FruitsPage;