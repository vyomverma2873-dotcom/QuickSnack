import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  isVerified: boolean;
  role?: string;
}

export interface Address {
  _id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); // 7 days
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export const logout = () => {
  removeAuthToken();
  removeUser();
  window.location.href = '/';
};
