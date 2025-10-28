import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Plus, Clock, Grid, List, ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
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
  description?: string;
}

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching all products from API...');
        const response = await api.get('/products');
        
        console.log('All products API response:', response.data);
        
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
            deliveryTime: '15 mins',
            inStock: product.inStock,
            discount: product.discount?.percentage || 0,
            description: product.description
          }));
          
          console.log('Transformed all products:', transformedProducts);
          // Debug: Check image URLs specifically
          transformedProducts.forEach((product: Product) => {
            console.log(`Product: ${product.name}, Image URL: "${product.image}", Type: ${typeof product.image}, Starts with http: ${product.image?.startsWith('http')}`);
          });
          setAllProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching all products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update category from URL params
  useEffect(() => {
    const { category } = router.query;
    if (category && typeof category === 'string') {
      setSelectedCategory(category);
    }
  }, [router.query]);

  const categories = [
    'all',
    'Snacks and Munchies',
    'Cold Drinks',
    'Paan Corner',
    'Sweet Tooth'
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
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
  }, [searchTerm, selectedCategory, sortBy]);

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
        <title>All Products - QuickSnack</title>
        <meta name="description" content="Browse all products available on QuickSnack" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-blue-gray/5 to-mint-green/10 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-slate-blue-gray mb-4">All Products</h1>
              <p className="text-slate-blue-gray/70 max-w-2xl mx-auto">
                Discover our complete range of fresh groceries and daily essentials
              </p>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green appearance-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-mint-green text-white'
                        : 'bg-light-grayish-blue/50 text-slate-blue-gray hover:bg-mint-green/20'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-colors ${
                      viewMode === 'list'
                        ? 'bg-mint-green text-white'
                        : 'bg-light-grayish-blue/50 text-slate-blue-gray hover:bg-mint-green/20'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-slate-blue-gray/70">
                Showing {filteredAndSortedProducts.length} products
              </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green mx-auto mb-4"></div>
                <p className="text-slate-blue-gray/70">Loading products...</p>
              </motion.div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <ShoppingCart className="w-16 h-16 text-slate-blue-gray/30 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-blue-gray mb-2">No Products Found</h3>
                <p className="text-slate-blue-gray/70 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Our product catalog will be available soon. Check back later!'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center gap-4'
                    }`}
                  >
                    {/* Product Image */}
                    <div className={viewMode === 'grid' ? 'text-center mb-4' : 'flex-shrink-0'}>
                      <div className={`${viewMode === 'grid' ? 'w-32 h-32 mb-2 mx-auto' : 'w-20 h-20'} group-hover:scale-110 transition-transform duration-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative`}>
                        {product.image && (product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                          <>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onLoad={() => console.log('✅ Image loaded successfully:', product.name, product.image)}
                              onError={(e) => {
                                console.log('❌ Image failed to load:', product.name, product.image);
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="fallback-emoji text-4xl flex items-center justify-center w-full h-full absolute inset-0 bg-gray-100" style={{display: 'none'}}>
                              🛍️
                            </div>
                          </>
                        ) : (
                          <div className="text-4xl flex items-center justify-center w-full h-full">
                            🛍️
                            <div className="absolute bottom-1 right-1 text-xs bg-red-500 text-white px-1 rounded">
                              No URL
                            </div>
                          </div>
                        )}
                      </div>
                      {product.discount && (
                        <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={viewMode === 'grid' ? 'text-center mb-4' : 'flex-1'}>
                      <h3 className={`font-semibold text-slate-blue-gray mb-2 hover:text-mint-green transition-colors ${
                        viewMode === 'grid' ? '' : 'text-lg'
                      }`}>
                        {product.name}
                      </h3>
                      
                      {product.description && viewMode === 'list' && (
                        <p className="text-sm text-slate-blue-gray/70 mb-2">{product.description}</p>
                      )}

                      {/* Rating */}
                      <div className={`flex items-center gap-1 mb-2 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-blue-gray">{product.rating}</span>
                        <span className="text-sm text-slate-blue-gray/60">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className={`flex items-center gap-2 mb-2 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                        <span className="text-lg font-bold text-mint-green">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-blue-gray/60 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div className={`flex items-center gap-4 text-xs text-slate-blue-gray/70 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{product.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock || addingToCart === product.id}
                        className={`${viewMode === 'grid' ? 'w-full' : 'px-6'} py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          product.inStock
                            ? 'bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray hover:shadow-lg hover:scale-105'
                            : 'bg-slate-blue-gray/20 text-slate-blue-gray/50 cursor-not-allowed'
                        }`}
                      >
                        {addingToCart === product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-blue-gray border-t-transparent"></div>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </>
                        )}
                      </button>
                    </div>
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

export default ProductsPage;
