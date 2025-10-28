import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Star, Plus, Clock, Truck } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import api from '@/lib/api';

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

const FeaturedProducts: React.FC = () => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('FeaturedProducts component mounted, loading:', loading, 'products count:', featuredProducts.length);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from API...');
        const response = await api.get('/products?featured=true&limit=8');
        
        console.log('Products API response:', response.data);
        
        if (response.data.success) {
          // Transform backend product data to match frontend interface
          const transformedProducts = response.data.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.ratings?.average || 4.5,
            reviews: product.ratings?.count || 0,
            image: product.images?.[0]?.url || '', // Use first image or empty string
            category: product.category,
            deliveryTime: '15 mins',
            inStock: product.inStock,
            discount: product.discount?.percentage || 0,
            description: product.description
          }));
          
          // Show only first 8 products as featured
          console.log('Transformed products:', transformedProducts);
          setFeaturedProducts(transformedProducts.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Show loading state
  if (loading) {
    return (
      <section className="py-16 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state when no products
  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-400 mb-8">
              Our featured products will appear here once they're added to the catalog.
            </p>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Featured Products Yet</h3>
              <p className="text-gray-400">
                Check back soon for our amazing featured products!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of the finest products, delivered fresh to your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
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
                    <div className="w-full h-full flex items-center justify-center bg-white/10 text-6xl">
                      🛍️
                    </div>
                  )}
                  <div className="w-full h-full hidden items-center justify-center bg-white/10 text-6xl">
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
                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg font-bold text-purple-400">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{product.deliveryTime}</span>
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
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
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
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
