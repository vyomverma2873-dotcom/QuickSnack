import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Zap, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

// Mock products for the instant food category
const instantProducts = [
  {
    id: 'instant-1',
    name: 'Instant Ramen Noodles',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.2,
    inStock: true
  },
  {
    id: 'instant-2',
    name: 'Instant Oatmeal',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1574635620108-1b4e0e6b7b6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.5,
    inStock: true
  },
  {
    id: 'instant-3',
    name: 'Instant Mac & Cheese',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.3,
    inStock: true
  },
  {
    id: 'instant-4',
    name: 'Instant Soup Mix',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.1,
    inStock: true
  },
  {
    id: 'instant-5',
    name: 'Instant Coffee',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.4,
    inStock: true
  },
  {
    id: 'instant-6',
    name: 'Instant Rice',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.0,
    inStock: true
  },
  {
    id: 'instant-7',
    name: 'Instant Pancake Mix',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 4.6,
    inStock: true
  },
  {
    id: 'instant-8',
    name: 'Instant Mashed Potatoes',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'instant',
    rating: 3.9,
    inStock: true
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

const InstantPage: React.FC = () => {
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

  const sortedProducts = sortProducts(instantProducts);

  return (
    <>
      <Head>
        <title>Instant Food - QuickSnack</title>
        <meta 
          name="description" 
          content="Shop instant food with fast delivery. Noodles, oatmeal, soup, coffee and more at great prices." 
        />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Instant Food</h1>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                  <label htmlFor="price-3" className="ml-3 text-sm text-gray-600">$5 to $7</label>
                </div>
                <div className="flex items-center">
                  <input id="price-4" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-4" className="ml-3 text-sm text-gray-600">$7+</label>
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

export default InstantPage;
