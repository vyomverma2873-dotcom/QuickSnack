import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout';
import { Search as SearchIcon, Filter, ShoppingCart, Star } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { productsAPI } from '@/lib/api';
import SearchBar from '@/components/Layout/SearchBar';
import toast from 'react-hot-toast';

// Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  category: string;
  ratings: {
    average: number;
    count: number;
  };
  inStock: boolean;
  discount: {
    percentage: number;
    validFrom?: Date;
    validTo?: Date;
  };
  description: string;
  tags?: string[];
  brand?: string;
  unit: string;
  quantity: number;
}

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        if (q) {
          setSearchQuery(q as string);
          // Search for products using API
          const response = await productsAPI.searchProducts(q as string, 50);
          setProducts(response.data.data || []);
        } else {
          // Show all products if no search query
          const response = await productsAPI.getProducts({ limit: 50 });
          setProducts(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '🛒';
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: primaryImage
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = ['All', 'Snacks and Munchies', 'Cold Drinks', 'Paan Corner', 'Sweet Tooth'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Head>
        <title>{q ? `Search results for "${q}"` : 'Search Products'} | QuickSnack</title>
        <meta name="description" content="Search for groceries, snacks, and daily essentials" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <SearchBar placeholder="Search for products..." />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters */}
            <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-slate-blue-gray" />
                <h3 className="font-semibold text-slate-blue-gray">Filters</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category
                          ? 'bg-mint-green bg-opacity-20 text-slate-blue-gray font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-blue-gray mb-6">
                {q ? `Search results for "${q}"` : 'All Products'}
                <span className="text-gray-500 text-lg ml-2">({filteredProducts.length} items)</span>
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-green"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-slate-blue-gray mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-48 bg-gray-100 relative">
                        {product.discount && product.discount.percentage > 0 && (
                          <span className="absolute top-2 left-2 bg-peach text-slate-blue-gray text-xs font-semibold px-2 py-1 rounded-full">
                            {product.discount.percentage}% OFF
                          </span>
                        )}
                        <div className="w-full h-full flex items-center justify-center">
                          {(() => {
                            const imageUrl = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url;
                            if (imageUrl && imageUrl.startsWith('http')) {
                              return (
                                <img 
                                  src={imageUrl} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              );
                            } else {
                              return <span className="text-6xl">📦</span>;
                            }
                          })()}
                          <div className="w-full h-full items-center justify-center text-6xl hidden">
                            📦
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium text-gray-500">{product.category}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium text-gray-500 ml-1">{product.ratings?.average || 0}</span>
                            <span className="text-xs text-gray-400 ml-1">({product.ratings?.count || 0})</span>
                          </div>
                        </div>
                        <h3 className="font-medium text-slate-blue-gray mb-1">{product.name}</h3>
                        <div className="flex items-center mb-3">
                          <span className="font-semibold text-slate-blue-gray">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full flex items-center justify-center space-x-2 bg-mint-green text-slate-blue-gray py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SearchPage;