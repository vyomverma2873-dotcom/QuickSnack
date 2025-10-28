import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, Package, Clock, Box } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { isAuthenticated, getUser } from '@/lib/auth';
import { useRouter } from 'next/router';
import { adminAPI } from '@/lib/api';

interface DashboardMetrics {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: any[];
  recentUsers: any[];
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

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
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const response = await adminAPI.getMetrics();
      
      if (response.data.success) {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
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
        <title>Admin Dashboard - QuickSnack</title>
        <meta name="description" content="QuickSnack Admin Dashboard - Manage orders, users, and analytics" />
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
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Welcome back, {user?.name}! Here's what's happening with QuickSnack today.
              </p>
            </motion.div>

            {/* Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {/* Total Users */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-emerald-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Total Orders */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-orange-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Total Products */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.totalProducts}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Box className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Total Revenue */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-white mt-2">₹{metrics.totalRevenue}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Pending Orders Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-yellow-400/50 transition-all duration-300 mb-12"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Pending Orders</p>
                  <p className="text-4xl font-bold text-white mt-2">{metrics.pendingOrders}</p>
                  <p className="text-gray-500 text-sm mt-1">Orders awaiting processing</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <motion.button
                onClick={() => router.push('/admin/orders')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border border-emerald-500/30"
              >
                <Package className="w-8 h-8 mx-auto mb-3" />
                <span className="text-lg">Manage Orders</span>
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/admin/users')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 border border-orange-500/30"
              >
                <Users className="w-8 h-8 mx-auto mb-3" />
                <span className="text-lg">Manage Users</span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/admin/products')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/30"
              >
                <Box className="w-8 h-8 mx-auto mb-3" />
                <span className="text-lg">Manage Products</span>
              </motion.button>
            </motion.div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                  <span>Recent Orders</span>
                </h3>
                <div className="space-y-4">
                  {metrics.recentOrders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div>
                        <p className="font-semibold text-white">#{order.orderId}</p>
                        <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatCurrency(order.amount)}</p>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          order.status === 'dispatched' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Users */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-emerald-400/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <span>Recent Users</span>
                </h3>
                <div className="space-y-4">
                  {metrics.recentUsers.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-400">{formatDate(user.createdAt)}</p>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          user.isVerified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard;
