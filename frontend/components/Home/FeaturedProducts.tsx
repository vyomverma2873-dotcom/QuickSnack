import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Star, Plus, Clock, Truck } from 'lucide-react';
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
}

const featuredProducts: Product[] = [
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
    discount: 25
  },
  {
    id: '2',
    name: 'Organic Milk 1L',
    price: 85,
    rating: 4.8,
    reviews: 256,
    image: '🥛',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: true
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    price: 45,
    originalPrice: 55,
    rating: 4.3,
    reviews: 89,
    image: '🍞',
    category: 'Bakery',
    deliveryTime: '12 mins',
    inStock: true,
    discount: 18
  },
  {
    id: '4',
    name: 'Fresh Tomatoes 500g',
    price: 32,
    rating: 4.6,
    reviews: 167,
    image: '🍅',
    category: 'Vegetables',
    deliveryTime: '10 mins',
    inStock: true
  },
  {
    id: '5',
    name: 'Basmati Rice 1kg',
    price: 120,
    originalPrice: 140,
    rating: 4.7,
    reviews: 234,
    image: '🌾',
    category: 'Grains',
    deliveryTime: '15 mins',
    inStock: true,
    discount: 14
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    price: 95,
    rating: 4.4,
    reviews: 145,
    image: '🥛',
    category: 'Dairy',
    deliveryTime: '8 mins',
    inStock: false
  },
  {
    id: '7',
    name: 'Mixed Nuts 200g',
    price: 180,
    originalPrice: 220,
    rating: 4.9,
    reviews: 312,
    image: '🥜',
    category: 'Snacks',
    deliveryTime: '12 mins',
    inStock: true,
    discount: 18
  },
  {
    id: '8',
    name: 'Fresh Orange Juice',
    price: 75,
    rating: 4.2,
    reviews: 98,
    image: '🍊',
    category: 'Beverages',
    deliveryTime: '10 mins',
    inStock: true
  }
];

const FeaturedProducts: React.FC = () => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    setAddingToCart(product.id);
    
    try {
      const updatedCart = await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
      
      console.log('Product added to cart:', product.name, 'New cart:', updatedCart);
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
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Handpicked fresh products with the best quality and prices
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20 overflow-hidden">
                {/* Product Image */}
                <div className="relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-700/50">
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-500/30">
                      Out of Stock
                    </div>
                  )}

                  {/* Product Image/Emoji */}
                  <div className="text-7xl text-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {product.image}
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-emerald-400 bg-emerald-500/10 rounded-full px-4 py-2 border border-emerald-500/20">
                    <Clock className="w-4 h-4" />
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Category */}
                  <div className="text-xs text-blue-400 uppercase tracking-wide mb-3 font-semibold">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-white mb-3 group-hover:text-blue-200 transition-colors text-lg">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold text-white">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                    whileTap={{ scale: product.inStock ? 0.98 : 1 }}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock || addingToCart === product.id}
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-lg'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {addingToCart === product.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Products Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button 
            onClick={() => router.push('/products')}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group border border-white/20"
          >
            <Truck className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
            View All Products
            <Plus className="w-6 h-6 ml-3 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
