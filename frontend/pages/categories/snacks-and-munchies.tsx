import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Star, Plus, Clock, Truck, Cookie, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews?: number;
  image: string;
  category: string;
  categoryId: string;
  deliveryTime?: string;
  inStock: boolean;
  discount?: number;
  description: string;
}

const SnacksAndMunchiesPage: React.FC = () => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products for Snacks and Munchies category...');
        const response = await api.get('/products?category=' + encodeURIComponent('Snacks and Munchies'));
        
        console.log('Category API response:', response.data);
        
        if (response.data.success) {
          // Transform backend product data to match frontend interface
          const transformedProducts = response.data.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.ratings?.average || 4.5,
            reviews: product.ratings?.count || 0,
            image: product.images?.[0]?.url || '',
            category: product.category,
            categoryId: 'snacks-munchies',
            deliveryTime: '15 mins',
            inStock: product.inStock,
            discount: product.discount?.percentage || 0,
            description: product.description
          }));
          
          console.log('Transformed category products:', transformedProducts);
          setAllProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Since we're already filtering by category in the API call, use all products directly
  const categoryProducts = allProducts;

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <>
      <Head>
        <title>Snacks and Munchies - QuickSnack</title>
        <meta name="description" content="Delicious snacks and munchies for every craving" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-blue-gray" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl text-white shadow-lg">
                    <Cookie className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-slate-blue-gray">Snacks and Munchies</h1>
                    <p className="text-slate-blue-gray/70 mt-2">
                      Delicious snacks for every craving
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-slate-blue-gray/70">Loading products...</p>
              </motion.div>
            ) : categoryProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Cookie className="w-16 h-16 text-slate-blue-gray/30 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-blue-gray mb-2">No Products Yet</h3>
                <p className="text-slate-blue-gray/70 mb-6">
                  We're working on adding amazing snacks and munchies to this category. Check back soon!
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Browse All Products
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {categoryProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    {/* Product Image */}
                    <div className="text-center mb-4">
                      <div className="w-full h-48 mb-2 group-hover:scale-110 transition-transform duration-300 rounded-xl overflow-hidden">
                        {product.image && (product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl">
                            🛍️
                          </div>
                        )}
                        <div className="w-full h-full hidden items-center justify-center bg-gray-100 text-6xl">
                          🛍️
                        </div>
                      </div>
                      {product.discount && (
                        <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-slate-blue-gray mb-2 group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-blue-gray">{product.rating}</span>
                        <span className="text-sm text-slate-blue-gray/60">({product.reviews || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-bold text-orange-500">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-blue-gray/60 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div className="flex items-center justify-center gap-4 text-xs text-slate-blue-gray/70">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{product.deliveryTime || '15 mins'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Fast Delivery</span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || addingToCart === product.id}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        product.inStock
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-slate-blue-gray/20 text-slate-blue-gray/50 cursor-not-allowed'
                      }`}
                    >
                      {addingToCart === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SnacksAndMunchiesPage;
