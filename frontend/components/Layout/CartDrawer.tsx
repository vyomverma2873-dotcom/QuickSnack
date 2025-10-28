import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { getCart, updateCartItemQuantity, removeFromCart, clearCart, type CartItem } from '@/lib/cart';
import { isAuthenticated } from '@/lib/auth';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    if (isOpen) {
      const currentCart = getCart();
      setCart(currentCart);
      console.log('CartDrawer opened, current cart:', currentCart);
      console.log('Cart items length:', currentCart.items.length);
      console.log('Should show checkout button:', currentCart.items.length > 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = getCart();
      setCart(updatedCart);
      console.log('CartDrawer: Cart updated via event:', updatedCart);
    };

    // Listen for cart updates
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(itemId, newQuantity);
    setCart(updatedCart);
    
    // Dispatch events to update navbar cart count
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
    toast.success('Item removed from cart');
    
    // Dispatch events to update navbar cart count
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleClearCart = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
    toast.success('Cart cleared');
    
    // Dispatch events to update navbar cart count
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to proceed with checkout');
      router.push('/auth/login');
      onClose();
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    router.push('/checkout');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in-right border-l border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Your Cart ({cart.itemCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col" style={{height: 'calc(100vh - 80px)'}}>
          {cart.items.length > 0 ? (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 pb-0">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>

                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  className="w-full mt-6 mb-4 p-3 text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="border-t border-white/10 p-6 bg-gray-800/50 backdrop-blur-sm mt-auto">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-white">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl text-lg hover:scale-105"
                  >
                    🛒 Place Order
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full border-2 border-blue-500 text-blue-400 font-semibold py-3 px-6 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-6 bg-gray-800/50 rounded-2xl mb-6">
                <ShoppingBag className="w-24 h-24 text-gray-500 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Your cart is empty</h3>
              <p className="text-gray-400 mb-8 max-w-sm">Add some delicious items to get started on your food journey!</p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300">
      {/* Item Image */}
      <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center border border-white/10">
        {item.image && item.image.length <= 4 ? (
          <span className="text-3xl">{item.image}</span>
        ) : (
          <span className="text-3xl">🛒</span>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate mb-1">{item.name}</h4>
        <p className="text-sm text-gray-400">₹{item.price.toFixed(2)} each</p>
        <p className="text-lg font-bold text-blue-400">₹{(item.price * item.quantity).toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition-colors border border-white/20"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <span className="w-8 text-center font-bold text-white text-lg">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;
