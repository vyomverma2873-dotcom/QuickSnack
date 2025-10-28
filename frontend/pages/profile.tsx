import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Plus, 
  Trash2, 
  Save, 
  X,
  Loader2
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { userAPI } from '@/lib/api';
import { isAuthenticated, getUser, setUser, type User as UserType, type Address } from '@/lib/auth';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUserState] = useState<UserType | null>(getUser());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

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

    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data.user;
      setUserState(userData);
      setUser(userData);
      setFormData({
        name: userData.name,
        phone: userData.phone
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userAPI.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      const updatedUser = response.data.user;
      setUserState(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userAPI.addAddress({
        ...newAddress,
        isDefault: !user?.addresses || user.addresses.length === 0
      });
      
      const updatedUser = { ...user!, addresses: response.data.addresses };
      setUserState(updatedUser);
      setUser(updatedUser);
      setNewAddress({ label: '', address: '', city: '', state: '', pincode: '' });
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await userAPI.deleteAddress(addressId);
      const updatedUser = { ...user!, addresses: response.data.addresses };
      setUserState(updatedUser);
      setUser(updatedUser);
      toast.success('Address deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-light-grayish-blue flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-mint-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - QuickSnack</title>
        <meta name="description" content="Manage your QuickSnack profile and addresses" />
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
                <h1 className="text-3xl font-bold text-slate-blue-gray mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your account information and addresses</p>
              </div>

              <div className="space-y-8">
                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray">Profile Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-outline text-sm py-2 px-4"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="input-field pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              className="input-field pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={user.email}
                            className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name,
                              phone: user.phone
                            });
                          }}
                          className="btn-outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <p className="text-slate-blue-gray font-medium">{user.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <p className="text-slate-blue-gray font-medium">{user.phone}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <p className="text-slate-blue-gray font-medium">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Status
                        </label>
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Addresses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-blue-gray">Saved Addresses</h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn-outline text-sm py-2 px-4"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </button>
                  </div>

                  {/* Address List */}
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <div
                          key={address._id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-5 h-5 text-slate-blue-gray" />
                                <span className="font-semibold text-slate-blue-gray">{address.label}</span>
                                {address.isDefault && (
                                  <span className="text-xs bg-mint-green text-slate-blue-gray px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 ml-7">
                                {address.address}, {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No addresses saved</p>
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
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              'Add Address'
                            )}
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
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProfilePage;
