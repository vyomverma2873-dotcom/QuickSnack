import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Beef, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

// Mock products for the meat & fish category
const meatProducts = [
  {
    id: 'meat-1',
    name: 'Fresh Salmon Fillet',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.8,
    inStock: true
  },
  {
    id: 'meat-2',
    name: 'Chicken Breast',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.6,
    inStock: true
  },
  {
    id: 'meat-3',
    name: 'Ground Beef',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1588347818481-c7c1e7c1b9d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.5,
    inStock: true
  },
  {
    id: 'meat-4',
    name: 'Pork Chops',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1588347818481-c7c1e7c1b9d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.4,
    inStock: true
  },
  {
    id: 'meat-5',
    name: 'Shrimp (Large)',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.7,
    inStock: true
  },
  {
    id: 'meat-6',
    name: 'Turkey Slices',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
    category: 'meat',
    rating: 4.3,
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

const MeatPage: React.FC = () => {
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

  const sortedProducts = sortProducts(meatProducts);

  return (
    <>
      <Head>
        <title>Meat & Fish - QuickSnack</title>
        <meta 
          name="description" 
          content="Shop fresh meat and fish with fast delivery. Chicken, beef, salmon, shrimp and more at great prices." 
        />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Beef className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Meat & Fish</h1>
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
                  <label htmlFor="price-1" className="ml-3 text-sm text-gray-600">Under $10</label>
                </div>
                <div className="flex items-center">
                  <input id="price-2" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-2" className="ml-3 text-sm text-gray-600">$10 to $15</label>
                </div>
                <div className="flex items-center">
                  <input id="price-3" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-3" className="ml-3 text-sm text-gray-600">$15 to $20</label>
                </div>
                <div className="flex items-center">
                  <input id="price-4" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="price-4" className="ml-3 text-sm text-gray-600">$20+</label>
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

export default MeatPage;
