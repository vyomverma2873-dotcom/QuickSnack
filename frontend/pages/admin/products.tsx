import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, Plus, Package, Image, DollarSign, ToggleLeft, ToggleRight, X } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { isAuthenticated, getUser, getAuthToken } from '@/lib/auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  unit: string;
  quantity: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  inStock: boolean;
  stockCount: number;
  isActive: boolean;
  tags: string[];
  brand?: string;
  discount: {
    percentage: number;
    validFrom?: Date;
    validTo?: Date;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

const ProductsManagement: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [
    'Snacks and Munchies',
    'Cold Drinks',
    'Paan Corner',
    'Sweet Tooth'
  ];

  const units = ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen'];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/unauthorized');
      return;
    }

    const currentUser = getUser();
    if (!currentUser || currentUser.email !== 'vyomverma2873@gmail.com') {
      router.push('/admin/unauthorized');
      return;
    }

    setUser(currentUser);
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by stock status
    if (stockFilter !== 'all') {
      const inStock = stockFilter === 'inStock';
      filtered = filtered.filter(product => product.inStock === inStock);
    }

    setFilteredProducts(filtered);
  };

  const toggleProductStatus = async (productId: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products/${productId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchProducts(); // Refresh products
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh products
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getStatusBadge = (product: Product) => {
    if (!product.isActive) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
    }
    if (!product.inStock) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
    }
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">In Stock</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-blue-gray/5 to-mint-green/10 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green mx-auto mb-4"></div>
            <p className="text-slate-blue-gray/70">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Products Management - QuickSnack Admin</title>
        <meta name="description" content="Manage products in QuickSnack admin panel" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-blue-gray/5 to-mint-green/10 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-blue-gray mb-2">Products Management</h1>
                  <p className="text-slate-blue-gray/70">Manage your product catalog</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green appearance-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green appearance-none"
                  >
                    <option value="all">All Stock Status</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-mint-green/10 rounded-xl px-4 py-3">
                  <span className="text-slate-blue-gray font-medium">
                    {filteredProducts.length} Products
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(product)}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-blue-gray mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-blue-gray/70 mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-mint-green">₹{product.price}</span>
                      <span className="text-sm text-slate-blue-gray/70">{product.quantity} {product.unit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-blue-gray/70">
                      <span>Stock: {product.stockCount}</span>
                      <span className="px-2 py-1 bg-light-grayish-blue/50 rounded">{product.category}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleProductStatus(product._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="w-16 h-16 text-slate-blue-gray/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-blue-gray mb-2">No Products Found</h3>
                <p className="text-slate-blue-gray/70 mb-6">
                  {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' 
                    ? 'Try adjusting your filters to see more products.'
                    : 'Get started by adding your first product.'
                  }
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add First Product
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Product Details Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-blue-gray">Product Details</h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Images */}
                {selectedProduct.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={image.alt || selectedProduct.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-slate-blue-gray">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-slate-blue-gray">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <p className="text-slate-blue-gray">₹{selectedProduct.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <p className="text-slate-blue-gray">{selectedProduct.stockCount} units</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-slate-blue-gray">{selectedProduct.description}</p>
                </div>

                {/* Tags */}
                {selectedProduct.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-mint-green/20 text-slate-blue-gray text-sm rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <AddProductModal
            categories={categories}
            units={units}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchProducts();
            }}
          />
        )}

        {/* Edit Product Modal */}
        {showEditModal && editingProduct && (
          <EditProductModal
            product={editingProduct}
            categories={categories}
            units={units}
            onClose={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        )}
      </Layout>
    </>
  );
};

// Add Product Modal Component
interface AddProductModalProps {
  categories: string[];
  units: string[];
  onClose: () => void;
  onSuccess: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ categories, units, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: categories[0] || '',
    subcategory: '',
    unit: units[0] || 'piece',
    quantity: '1',
    stockCount: '',
    brand: '',
    tags: '',
    discount: '0',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.stockCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        stockCount: parseInt(formData.stockCount),
        brand: formData.brand || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        discount: {
          percentage: parseFloat(formData.discount) || 0
        },
        images: formData.imageUrl ? [{
          url: formData.imageUrl,
          alt: formData.name,
          isPrimary: true
        }] : [],
        inStock: parseInt(formData.stockCount) > 0,
        isActive: true
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Product added successfully!');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      const message = error.response?.data?.message || 'Failed to add product';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-slate-blue-gray">Add New Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Stock Count *
              </label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-blue-gray mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., organic, fresh, premium"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-blue-gray mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
            />
          </div>
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-blue-gray border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Edit Product Modal Component
interface EditProductModalProps {
  product: Product;
  categories: string[];
  units: string[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, categories, units, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    originalPrice: product.originalPrice?.toString() || '',
    category: product.category,
    subcategory: product.subcategory || '',
    unit: product.unit,
    quantity: product.quantity.toString(),
    stockCount: product.stockCount.toString(),
    brand: product.brand || '',
    tags: product.tags.join(', '),
    discount: product.discount.percentage.toString(),
    imageUrl: product.images[0]?.url || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.stockCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        stockCount: parseInt(formData.stockCount),
        brand: formData.brand || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        discount: {
          percentage: parseFloat(formData.discount) || 0
        },
        images: formData.imageUrl ? [{
          url: formData.imageUrl,
          alt: formData.name,
          isPrimary: true
        }] : product.images
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products/${product._id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Product updated successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-slate-blue-gray">Edit Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Stock Count *
              </label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-blue-gray mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., organic, fresh, premium"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-blue-gray mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-blue-gray mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green bg-white text-gray-900"
            />
          </div>
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-blue-gray border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductsManagement;
