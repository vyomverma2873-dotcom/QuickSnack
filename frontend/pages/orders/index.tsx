import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home,
  ShoppingBag,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { ordersAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  amount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [selectedStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await ordersAPI.getOrders(params);
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'dispatched':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'dispatched':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Home className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <>
      <Head>
        <title>My Orders - QuickSnack</title>
        <meta name="description" content="View and track your QuickSnack orders" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-light-grayish-blue py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-blue-gray mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage your QuickSnack orders</p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-3">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-mint-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/orders/${order.orderId}`}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-mint-green to-sky-blue rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-slate-blue-gray" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-blue-gray group-hover:text-slate-blue-gray/80 transition-colors">
                                    Order #{order.orderId}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Order Items Preview */}
                              <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">
                                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {order.items.slice(0, 3).map((item, itemIndex) => (
                                    <span
                                      key={itemIndex}
                                      className="text-xs bg-light-grayish-blue text-slate-blue-gray px-2 py-1 rounded-full"
                                    >
                                      {item.name} x{item.qty}
                                    </span>
                                  ))}
                                  {order.items.length > 3 && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      +{order.items.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Amount */}
                              <p className="text-lg font-bold text-slate-blue-gray">
                                ₹{order.amount.toFixed(2)}
                              </p>
                            </div>

                            {/* Status & Action */}
                            <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end space-y-3 mt-4 md:mt-0">
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </div>
                              
                              <div className="flex items-center text-slate-blue-gray group-hover:text-slate-blue-gray/80 transition-colors">
                                <span className="text-sm font-medium mr-2">View Details</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-600 mb-2">
                    {searchQuery ? 'No matching orders' : 'No orders yet'}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start shopping to see your orders here'
                    }
                  </p>
                  {!searchQuery && (
                    <Link href="/" className="btn-primary">
                      Start Shopping
                    </Link>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-light-grayish-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-mint-green text-slate-blue-gray font-semibold'
                              : 'border border-gray-200 hover:bg-light-grayish-blue'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-light-grayish-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrdersPage;
