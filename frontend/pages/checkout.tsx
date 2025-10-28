import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ShoppingBag, Plus, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { getCart, clearCart, type CartItem } from '@/lib/cart';
import { getUser, isAuthenticated, type Address } from '@/lib/auth';
import { userAPI, ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState(getCart());
  const [user, setUser] = useState(getUser());
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'upi'>('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (cart.items.length === 0) {
      router.push('/');
      return;
    }

    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data.user;
      setUser(userData);
      setAddresses(userData.addresses || []);
      
      // Auto-select default address
      const defaultAddress = userData.addresses?.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await userAPI.addAddress({
        ...newAddress,
        isDefault: addresses.length === 0
      });
      
      setAddresses(response.data.addresses);
      setNewAddress({ label: '', address: '', city: '', state: '', pincode: '' });
      setShowAddressForm(false);
      toast.success('Address added successfully');
      
      // Auto-select if it's the first address
      if (addresses.length === 0) {
        const newAddr = response.data.addresses[response.data.addresses.length - 1];
        setSelectedAddressId(newAddr._id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    if (paymentMethod !== 'cod') {
      toast.error('Only Cash on Delivery is available at the moment');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        amount: cart.total,
        deliveryFee: deliveryFee,
        addressId: selectedAddressId,
        deliveryInstructions: deliveryInstructions.trim(),
        paymentMethod: {
          type: paymentMethod,
          details: paymentMethod === 'cod' ? { codAmount: totalAmount } : {}
        }
      };

      console.log('Placing order with data:', orderData);
      const response = await ordersAPI.createOrder(orderData);
      console.log('Order response:', response);
      
      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
      router.push(`/orders/${response.data.order.orderId}`);
    } catch (error: any) {
      console.error('Order placement error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deliveryFee = cart.total >= 299 ? 0 : 25;
  const totalAmount = cart.total + deliveryFee;

  return (
    <>
      <Head>
        <title>Checkout - QuickSnack</title>
        <meta name="description" content="Complete your order checkout" />
      </Head>

      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
                <p className="text-gray-400 text-xl">Review your order and complete the purchase</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Address & Instructions */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Delivery Address */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                          <MapPin className="w-6 h-6 text-blue-400" />
                        </div>
                        Delivery Address
                      </h2>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="btn-outline text-sm py-3 px-6"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New
                      </button>
                    </div>

                    {/* Address List */}
                    {addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              selectedAddressId === address._id
                                ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                                : 'border-white/20 hover:border-white/30 bg-gray-800/30'
                            }`}
                            onClick={() => setSelectedAddressId(address._id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-slate-blue-gray">{address.label}</span>
                                  {address.isDefault && (
                                    <span className="text-xs bg-peach text-slate-blue-gray px-2 py-1 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {address.address}, {address.city}, {address.state} - {address.pincode}
                                </p>
                              </div>
                              {selectedAddressId === address._id && (
                                <CheckCircle className="w-6 h-6 text-mint-green" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No addresses found</p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="btn-primary"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}

                    {/* Add Address Form */}
                    {showAddressForm && (
                      <div className="mt-6 p-4 bg-light-grayish-blue rounded-lg">
                        <h3 className="font-semibold text-slate-blue-gray mb-4">Add New Address</h3>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Address Label (Home, Office, etc.)"
                              value={newAddress.label}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                              className="input-field"
                              required
                            />
                          </div>
                          <textarea
                            placeholder="Full Address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                            className="input-field resize-none"
                            rows={3}
                            required
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                              className="input-field"
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button type="submit" className="btn-primary">
                              Add Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddressForm(false)}
                              className="btn-outline"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Delivery Instructions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4">
                      Delivery Instructions (Optional)
                    </h2>
                    <textarea
                      placeholder="Any specific instructions for delivery..."
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {deliveryInstructions.length}/200 characters
                    </p>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4 flex items-center">
                      <ShoppingBag className="w-6 h-6 mr-2" />
                      Order Summary ({cart.itemCount} items)
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-light-grayish-blue rounded-lg flex items-center justify-center text-2xl">
                            {item.image && item.image.length <= 4 ? item.image : '🛒'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-blue-gray truncate">{item.name}</h4>
                            <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-blue-gray">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{cart.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {cart.total < 299 && (
                        <p className="text-xs text-gray-500">
                          Add ₹{(299 - cart.total).toFixed(2)} more for free delivery
                        </p>
                      )}
                      <div className="flex justify-between text-lg font-bold text-slate-blue-gray border-t border-gray-100 pt-2">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-3">
                      {/* Cash on Delivery */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-mint-green bg-mint-green bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-blue-gray font-medium">Cash on Delivery</p>
                            <p className="text-sm text-gray-600">Pay when your order arrives</p>
                          </div>
                          {paymentMethod === 'cod' && (
                            <CheckCircle className="w-6 h-6 text-mint-green" />
                          )}
                        </div>
                      </div>

                      {/* Online Payment */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'online'
                            ? 'border-mint-green bg-mint-green bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('online')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-blue-gray font-medium">Online Payment</p>
                            <p className="text-sm text-gray-600">Pay securely with card/net banking</p>
                            <p className="text-xs text-orange-600 mt-1">Coming Soon</p>
                          </div>
                          {paymentMethod === 'online' && (
                            <CheckCircle className="w-6 h-6 text-mint-green" />
                          )}
                        </div>
                      </div>

                      {/* UPI Payment */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-mint-green bg-mint-green bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-blue-gray font-medium">UPI Payment</p>
                            <p className="text-sm text-gray-600">Pay with Google Pay, PhonePe, Paytm</p>
                            <p className="text-xs text-orange-600 mt-1">Coming Soon</p>
                          </div>
                          {paymentMethod === 'upi' && (
                            <CheckCircle className="w-6 h-6 text-mint-green" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !selectedAddressId}
                    className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      `Place Order - ₹${totalAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CheckoutPage;
