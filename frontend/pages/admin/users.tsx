import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, Users, Mail, Phone, MapPin, CheckCircle, XCircle, X } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { isAuthenticated, getUser, getAuthToken } from '@/lib/auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Array<{
    _id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

const AdminUsers: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/unauthorized');
      return;
    }

    const user = getUser();
    if (!user || user.email !== 'vyomverma2873@gmail.com') {
      router.push('/admin/unauthorized');
      return;
    }

    setCurrentUser(user);
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, verificationFilter]);

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by verification status
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      filtered = filtered.filter(user => user.isVerified === isVerified);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('User role updated successfully');
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const toggleUserVerification = async (userId: string, isVerified: boolean) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/verification`,
        { isVerified: !isVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`User ${!isVerified ? 'verified' : 'unverified'} successfully`);
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      console.error('Error updating user verification:', error);
      toast.error('Failed to update user verification');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-blue-gray/5 to-mint-green/10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mint-green"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Users Management - QuickSnack Admin</title>
        <meta name="description" content="Manage all QuickSnack users" />
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
              <h1 className="text-3xl font-bold text-slate-blue-gray mb-2">
                Users Management
              </h1>
              <p className="text-slate-blue-gray/70">
                Manage and monitor all registered users
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                  />
                </div>

                {/* Role Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                {/* Verification Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-blue-gray/50 w-5 h-5" />
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light-grayish-blue/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-blue-gray">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-blue-gray/10">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-light-grayish-blue/30 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-mint-green to-peach rounded-full flex items-center justify-center">
                              <span className="text-slate-blue-gray font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-blue-gray">{user.name}</p>
                              <p className="text-sm text-slate-blue-gray/70">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-blue-gray/70">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.isVerified ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-blue-gray/70">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 text-slate-blue-gray hover:bg-mint-green/20 rounded-lg transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => toggleUserVerification(user._id, user.isVerified)}
                              className="p-2 text-slate-blue-gray hover:bg-sky-blue/20 rounded-lg transition-colors duration-200"
                              title={user.isVerified ? 'Unverify User' : 'Verify User'}
                            >
                              {user.isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>

                            {user._id !== currentUser?.id && (
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-blue-gray/30 mx-auto mb-4" />
                  <p className="text-slate-blue-gray/70">No users found</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-blue-gray">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="p-2 hover:bg-light-grayish-blue/50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="flex items-center gap-4 p-4 bg-light-grayish-blue/50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-mint-green to-peach rounded-full flex items-center justify-center">
                      <span className="text-slate-blue-gray font-bold text-xl">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-blue-gray">{selectedUser.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedUser.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedUser.role}
                        </span>
                        {selectedUser.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-slate-blue-gray mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-light-grayish-blue/50 rounded-xl">
                        <Mail className="w-5 h-5 text-slate-blue-gray/70" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-light-grayish-blue/50 rounded-xl">
                        <Phone className="w-5 h-5 text-slate-blue-gray/70" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-blue-gray mb-3">Saved Addresses</h3>
                      <div className="space-y-3">
                        {selectedUser.addresses.map((address, index) => (
                          <div key={address._id} className="p-4 bg-light-grayish-blue/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-blue-gray">{address.label}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-mint-green/20 text-mint-green text-xs rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-blue-gray/70">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <p>{address.address}</p>
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Account Information */}
                  <div>
                    <h3 className="font-semibold text-slate-blue-gray mb-3">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-light-grayish-blue/50 rounded-xl">
                        <p className="text-sm text-slate-blue-gray/70">Joined</p>
                        <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div className="p-3 bg-light-grayish-blue/50 rounded-xl">
                        <p className="text-sm text-slate-blue-gray/70">Last Updated</p>
                        <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-blue-gray/10">
                    <select
                      value={selectedUser.role}
                      onChange={(e) => updateUserRole(selectedUser._id, e.target.value)}
                      className="px-4 py-2 bg-light-grayish-blue/50 border border-slate-blue-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    
                    <button
                      onClick={() => toggleUserVerification(selectedUser._id, selectedUser.isVerified)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                        selectedUser.isVerified
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {selectedUser.isVerified ? 'Unverify' : 'Verify'} User
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default AdminUsers;
