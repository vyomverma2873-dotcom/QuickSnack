import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, Package, Clock, CheckCircle, Truck, X } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { isAuthenticated, getUser, getAuthToken } from '@/lib/auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    qty: number;
    price: number;
  }>;
  amount: number;
  address: {
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminOrders: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'dispatched': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'dispatched': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Orders Management - QuickSnack Admin</title>
        <meta name="description" content="Manage all QuickSnack orders" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black pt-20 pb-12 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                Orders Management
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Manage and track all customer orders with real-time updates
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 mb-12"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <span className="font-medium text-white">#{order.orderId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">{order.userId?.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-400">{order.userId?.email || 'No email'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">{formatCurrency(order.amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {/* Status Update Dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="text-xs px-2 py-1 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-blue-gray/30 mx-auto mb-4" />
                  <p className="text-slate-blue-gray/70">No orders found</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-blue-gray">Order Details</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-light-grayish-blue/50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order Info */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-blue-gray mb-2">Order Information</h3>
                      <p><span className="font-medium">Order ID:</span> #{selectedOrder.orderId}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Amount:</span> {formatCurrency(selectedOrder.amount)}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-blue-gray mb-2">Customer Information</h3>
                      <p><span className="font-medium">Name:</span> {selectedOrder.userId.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.userId.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.userId.phone}</p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold text-slate-blue-gray mb-2">Delivery Address</h3>
                    <div className="bg-light-grayish-blue/50 p-4 rounded-xl">
                      <p className="font-medium">{selectedOrder.address.label}</p>
                      <p>{selectedOrder.address.address}</p>
                      <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-slate-blue-gray mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-light-grayish-blue/50 rounded-xl">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-blue-gray/70">Qty: {item.qty}</p>
                          </div>
                          <p className="font-semibold">{formatCurrency(item.price * item.qty)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {selectedOrder.deliveryInstructions && (
                    <div>
                      <h3 className="font-semibold text-slate-blue-gray mb-2">Delivery Instructions</h3>
                      <div className="bg-light-grayish-blue/50 p-4 rounded-xl">
                        <p>{selectedOrder.deliveryInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default AdminOrders;
