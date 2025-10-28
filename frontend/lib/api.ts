import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://quicksnack-final-backend.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
  timeout: 10000, // 10 seconds global timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try cookies first, then localStorage
    let token = Cookies.get('token');
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if we're on the login page or making a login request
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/auth/login';
      
      if (!isLoginRequest && !isOnLoginPage) {
        // Clear tokens and redirect to login only for authenticated requests
        Cookies.remove('token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; phone: string; password?: string }) =>
    api.post('/auth/signup', data),
  
  verifyOTP: (data: { email: string; otp: string; userData: any }) =>
    api.post('/auth/verify-otp', data),
  
  login: (data: { email: string; password?: string; useOTP?: boolean }) =>
    api.post('/auth/login', data),
  
  verifyLoginOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-login-otp', data),
  
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  
  verifyResetOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-reset-otp', data),
  
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/me'),
  
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/user/me', data),
  
  addAddress: (data: {
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
    isDefault?: boolean;
  }) => api.post('/user/addresses', data),
  
  updateAddress: (addressId: string, data: any) =>
    api.put(`/user/addresses/${addressId}`, data),
  
  deleteAddress: (addressId: string) =>
    api.delete(`/user/addresses/${addressId}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (data: {
    items: Array<{ productId: string; name: string; qty: number; price: number }>;
    amount: number;
    deliveryFee: number;
    addressId?: string;
    deliveryInstructions?: string;
    paymentMethod: {
      type: string;
      details: any;
    };
  }) => api.post('/orders', data),
  
  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders', { params }),
  
  getOrder: (orderId: string) => api.get(`/orders/${orderId}`),
  
  cancelOrder: (orderId: string) => api.put(`/orders/${orderId}/cancel`),
};

// Places API
export const placesAPI = {
  autocomplete: (query: string) =>
    api.get('/places/autocomplete', { params: { q: query } }),
  
  getDetails: (placeId: string) =>
    api.get(`/places/details/${placeId}`),
  
  reverseGeocode: (data: { lat: number; lng: number }) =>
    api.post('/places/reverse-geocode', data),
};

// Products API (public)
export const productsAPI = {
  getProducts: (params?: { page?: number; limit?: number; search?: string; category?: string; featured?: boolean }) =>
    api.get('/products', { params }),
  
  getProduct: (productId: string) =>
    api.get(`/products/${productId}`),
  
  searchProducts: (query: string, limit?: number) =>
    api.get('/products', { params: { search: query, limit } }),
  
  getProductsByCategory: (category: string, limit?: number) =>
    api.get(`/products/category/${category}`, { params: { limit } }),
};

// Admin API
export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  
  getOrders: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/admin/orders', { params }),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),
  
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/users', { params }),

  // Products management
  getProducts: (params?: { page?: number; limit?: number; search?: string; category?: string; inStock?: boolean }) =>
    api.get('/admin/products', { params }),
  
  createProduct: (data: any) =>
    api.post('/admin/products', data),
  
  updateProduct: (productId: string, data: any) =>
    api.put(`/admin/products/${productId}`, data),
  
  deleteProduct: (productId: string) =>
    api.delete(`/admin/products/${productId}`),
  
  toggleProductStatus: (productId: string) =>
    api.put(`/admin/products/${productId}/toggle-status`),
};

export default api;
