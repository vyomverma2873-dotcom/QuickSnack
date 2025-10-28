import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPin, ShoppingCart, User, Menu, X, Settings } from 'lucide-react';
import { isAuthenticated, getUser, logout } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import LocationPicker from './LocationPicker';
import CartDrawer from './CartDrawer';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    
    // Update cart count
    const cart = getCart();
    setCartItemCount(cart.itemCount);

    // Get saved location
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }

    // Listen for storage changes (cart updates)
    const handleStorageChange = () => {
      const updatedCart = getCart();
      const newCount = updatedCart.itemCount;
      
      // Trigger bounce animation if count increased
      if (newCount > cartItemCount) {
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 600);
      }
      
      setCartItemCount(newCount);
      console.log('Navbar: Cart updated, new count:', newCount);
    };

    // Listen for both storage events and custom cart events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    // Scroll detection for navbar styling using Lenis
    const handleLenisScroll = (event: CustomEvent) => {
      const scrollTop = event.detail.scroll;
      setIsScrolled(scrollTop > 10);
    };

    // Fallback to regular scroll if Lenis isn't available
    const handleRegularScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('lenisScroll', handleLenisScroll as EventListener);
    window.addEventListener('scroll', handleRegularScroll);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('lenisScroll', handleLenisScroll as EventListener);
      window.removeEventListener('scroll', handleRegularScroll);
    };
  }, []);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', location);
    setIsLocationModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-2xl shadow-2xl border-b border-white/10' 
            : 'bg-black/70 backdrop-blur-xl border-b border-white/5'
        }`}
        style={{
          background: isScrolled 
            ? `linear-gradient(135deg, 
                rgba(0, 0, 0, 0.95) 0%, 
                rgba(15, 15, 15, 0.95) 25%,
                rgba(25, 25, 35, 0.95) 50%,
                rgba(20, 20, 30, 0.95) 75%,
                rgba(0, 0, 0, 0.95) 100%)`
            : `linear-gradient(135deg, 
                rgba(0, 0, 0, 0.75) 0%, 
                rgba(15, 15, 15, 0.75) 25%,
                rgba(25, 25, 35, 0.75) 50%,
                rgba(20, 20, 30, 0.75) 75%,
                rgba(0, 0, 0, 0.75) 100%)`,
          backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(150%)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative">
                {/* Main logo container with better design */}
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border border-white/20 group-hover:border-white/40">
                  {/* Modern geometric logo design */}
                  <div className="relative w-5 h-5">
                    {/* Stylized "Q" shape made of geometric elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Outer circle */}
                      <div className="w-4 h-4 border-2 border-white rounded-full group-hover:border-yellow-200 transition-colors duration-300"></div>
                      {/* Inner diagonal line */}
                      <div className="absolute w-2 h-0.5 bg-white rounded-full transform rotate-45 translate-x-0.5 translate-y-0.5 group-hover:bg-yellow-200 transition-colors duration-300"></div>
                    </div>
                    
                    {/* Animated particles */}
                    <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-400 rounded-full group-hover:animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full group-hover:animate-ping animation-delay-150"></div>
                  </div>
                </div>
                
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-40 transition-all duration-500 blur-md scale-125 group-hover:animate-pulse"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out"></div>
              </div>
              <span className="text-lg font-semibold text-white group-hover:text-purple-200 transition-all duration-300 group-hover:tracking-wide">QuickSnack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-8">
              {/* Location Picker */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="group flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:shadow-lg"
              >
                <MapPin className="w-4 h-4 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                <span className="text-sm text-white/90 group-hover:text-white truncate max-w-32 font-medium">
                  {selectedLocation}
                </span>
              </button>

              {/* Search Bar */}
              <SearchBar className="flex-1 max-w-md" />
            </div>

            {/* Desktop Right Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Admin Panel - Show for everyone, but only vyomverma2873@gmail.com can access */}
              {true && (
                <Link
                  href="/admin"
                  className="group relative p-3 text-white hover:bg-gradient-to-r hover:from-mint-green/20 hover:to-peach/20 rounded-xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-mint-green/30"
                  title="Admin Panel"
                >
                  <Settings className="w-6 h-6 group-hover:text-mint-green transition-colors duration-300" />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-mint-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="group relative p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <ShoppingCart className="w-6 h-6 group-hover:text-blue-200 transition-colors duration-300" />
                {cartItemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 shadow-lg ${cartBounce ? 'cart-count-bounce' : ''}`}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2.5 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-lg">
                    <User className="w-5 h-5 text-blue-300" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      <Link href="/profile" className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                        Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="group-hover:text-blue-100 transition-colors duration-300">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-6 bg-black/20 backdrop-blur-sm">
              {/* Mobile Search */}
              <div className="mb-6">
                <SearchBar />
              </div>

              {/* Mobile Location */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 mb-6 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-sm text-white/90 font-medium">{selectedLocation}</span>
              </button>

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {/* Admin Panel - Mobile (Show for everyone, but only vyomverma2873@gmail.com can access) */}
                {true && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 w-full px-4 py-3 text-white hover:bg-gradient-to-r hover:from-mint-green/20 hover:to-peach/20 rounded-xl transition-all duration-300 border border-transparent hover:border-mint-green/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-mint-green" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-blue-300" />
                    <span className="font-medium">Cart</span>
                  </div>
                  {cartItemCount > 0 && (
                    <span className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full px-2.5 py-1 transition-all duration-200 shadow-lg ${cartBounce ? 'cart-count-bounce' : ''}`}>
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Location Modal */}
      <LocationPicker
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
