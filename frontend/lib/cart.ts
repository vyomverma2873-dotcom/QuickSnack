export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'quicksnack_cart';

// 🔑 Backend API Base URL (deployed on Render)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://quicksnack-final-backend.onrender.com';

export const getCart = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }

  try {
    const cartStr = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartStr) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const cart = JSON.parse(cartStr);
    return {
      ...cart,
      total: calculateTotal(cart.items),
      itemCount: calculateItemCount(cart.items),
    };
  } catch {
    return { items: [], total: 0, itemCount: 0 };
  }
};

export const saveCart = (cart: Cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
};

export const addToCart = async (
  item: Omit<CartItem, 'quantity'>,
  quantity: number = 1
): Promise<Cart> => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ ...item, quantity });
  }

  cart.total = calculateTotal(cart.items);
  cart.itemCount = calculateItemCount(cart.items);
  
  saveCart(cart);

  // Sync with backend if user is authenticated
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        await syncCartWithBackend();
      }
    }
  } catch (error) {
    console.error('Failed to sync cart with backend:', error);
  }

  return cart;
};

export const removeFromCart = (itemId: string): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  
  cart.total = calculateTotal(cart.items);
  cart.itemCount = calculateItemCount(cart.items);
  
  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (itemId: string, quantity: number): Cart => {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
  }

  cart.total = calculateTotal(cart.items);
  cart.itemCount = calculateItemCount(cart.items);
  
  saveCart(cart);
  return cart;
};

export const clearCart = (): Cart => {
  const emptyCart = { items: [], total: 0, itemCount: 0 };
  saveCart(emptyCart);
  return emptyCart;
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Sync local cart with backend
export const syncCartWithBackend = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const localCart = getCart();
    
    const response = await fetch(`${API_BASE_URL}/api/cart/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        localCart: localCart.items,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.cart) {
        // Update local cart with synced data
        const syncedCart = {
          items: data.cart.items.map((item: any) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: '', // Will be filled from local data if available
            category: '', // Will be filled from local data if available
          })),
          total: data.cart.total,
          itemCount: data.cart.itemCount,
        };
        
        saveCart(syncedCart);
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
};

// Load cart from backend for authenticated users
export const loadCartFromBackend = async (): Promise<Cart> => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return getCart();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.cart) {
        const backendCart = {
          items: data.cart.items.map((item: any) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: '', // Will be filled from local data if available
            category: '', // Will be filled from local data if available
          })),
          total: data.cart.total,
          itemCount: data.cart.itemCount,
        };
        
        saveCart(backendCart);
        return backendCart;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from backend:', error);
  }

  return getCart();
};
