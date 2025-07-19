'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// 1. Define the shape of your product
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  variant?: string;
};

// 2. Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  clearCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

// 3. Provide default value to context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Create provider with children props typed
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    console.log('Adding to cart:', product);
    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      // If it does, update the quantity
      setCart((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item))
      );
      return;
    }
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems:cart, clearCart: () => setCart([]), addToCart, removeFromCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 5. Safe hook usage
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
// 6. Export CartContext for direct access if needed'use client';