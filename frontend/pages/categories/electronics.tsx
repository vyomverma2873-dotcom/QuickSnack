import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Smartphone, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import { getProductsByCategory } from '@/lib/products';
import toast from 'react-hot-toast';

// Get electronics products from the centralized database
const electronicsProducts = getProductsByCategory('electronics');

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

const ElectronicsPage: React.FC = () => {
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

  const sortedProducts = sortProducts(electronicsProducts);

  return (
    <>
      <Head>
        <title>Electronics - QuickSnack</title>
        <meta 
          name="description" 
          content="Shop the latest electronics with fast delivery. Earbuds, chargers, speakers and more at great prices." 
        />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Electronics</h1>
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
                  <label htmlFor="price-1" className="ml-3 text-sm text-gray-600">Under $30</label>
                </div>
                <div className="flex items-center">
                  <input id="price-2" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-2" className="ml-3 text-sm text-gray-600">$30 to $50</label>
                </div>
                <div className="flex items-center">
                  <input id="price-3" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-3" className="ml-3 text-sm text-gray-600">$50 to $100</label>
                </div>
                <div className="flex items-center">
                  <input id="price-4" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-4" className="ml-3 text-sm text-gray-600">$100+</label>
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
                <div className="relative pb-[100%] bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
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

export default ElectronicsPage;