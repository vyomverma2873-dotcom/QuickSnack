import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home,
  ArrowLeft,
  Phone,
  Mail,
  Copy
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

interface OrderAddress {
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  amount: number;
  address: OrderAddress;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailsPage: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getOrder(orderId as string);
      setOrder(response.data.order);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
      router.push('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId);
      toast.success('Order ID copied to clipboard');
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
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'dispatched':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <Home className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getDeliveryEstimate = (status: string, createdAt: string) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));

    switch (status) {
      case 'pending':
        return 'Order being processed';
      case 'confirmed':
        return `Estimated delivery: ${15 - diffMinutes} minutes`;
      case 'dispatched':
        return `Arriving in ${10 - diffMinutes} minutes`;
      case 'delivered':
        return 'Order delivered';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return 'Processing...';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-light-grayish-blue flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-mint-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen bg-light-grayish-blue flex items-center justify-center">
          <div className="text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
            <Link href="/orders" className="btn-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Order {order.orderId} - QuickSnack</title>
        <meta name="description" content={`Order details for ${order.orderId}`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-light-grayish-blue py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/orders"
                  className="inline-flex items-center space-x-2 text-slate-blue-gray hover:text-slate-blue-gray/80 transition-colors mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Orders</span>
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-blue-gray mb-2">Order Details</h1>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-semibold text-slate-blue-gray">{order.orderId}</span>
                      <button
                        onClick={copyOrderId}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status Timeline */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-6">Order Status</h2>
                    
                    <div className="space-y-4">
                      {['pending', 'confirmed', 'dispatched', 'delivered'].map((status, index) => {
                        const isCompleted = ['pending', 'confirmed', 'dispatched', 'delivered'].indexOf(order.status) >= index;
                        const isCurrent = order.status === status;
                        
                        return (
                          <div key={status} className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-mint-green text-slate-blue-gray' 
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                              {getStatusIcon(status)}
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold capitalize ${
                                isCurrent ? 'text-slate-blue-gray' : isCompleted ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {status}
                              </div>
                              {isCurrent && (
                                <div className="text-sm text-gray-600">
                                  {getDeliveryEstimate(order.status, order.createdAt)}
                                </div>
                              )}
                            </div>
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-6">Order Items</h2>
                    
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-light-grayish-blue rounded-lg">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                            🛒
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-blue-gray">{item.name}</h4>
                            <p className="text-sm text-gray-600">₹{item.price} × {item.qty}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-blue-gray">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {order.deliveryInstructions && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-xl font-semibold text-slate-blue-gray mb-4">Delivery Instructions</h2>
                      <p className="text-gray-600">{order.deliveryInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex justify-between text-lg font-bold text-slate-blue-gray">
                          <span>Total</span>
                          <span>₹{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4 flex items-center">
                      <MapPin className="w-6 h-6 mr-2" />
                      Delivery Address
                    </h2>
                    
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-blue-gray">{order.address.label}</p>
                      <p className="text-gray-600">{order.address.address}</p>
                      <p className="text-gray-600">
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4">Need Help?</h2>
                    
                    <div className="space-y-3">
                      <a
                        href="tel:8766355495"
                        className="flex items-center space-x-3 p-3 bg-light-grayish-blue rounded-lg hover:bg-soft-lavender-gray transition-colors"
                      >
                        <Phone className="w-5 h-5 text-slate-blue-gray" />
                        <div>
                          <p className="font-semibold text-slate-blue-gray">Call Support</p>
                          <p className="text-sm text-gray-600">8766355495</p>
                        </div>
                      </a>
                      
                      <a
                        href="mailto:vyomverma2873@gmail.com"
                        className="flex items-center space-x-3 p-3 bg-light-grayish-blue rounded-lg hover:bg-soft-lavender-gray transition-colors"
                      >
                        <Mail className="w-5 h-5 text-slate-blue-gray" />
                        <div>
                          <p className="font-semibold text-slate-blue-gray">Email Support</p>
                          <p className="text-sm text-gray-600">vyomverma2873@gmail.com</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrderDetailsPage;
