import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = "cart_items";

export const CartContext = createContext();

function readStoredItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStoredItems());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item) {
    const cartItem = {
      ...item,
      cart_item_id: item.cart_item_id || `${item.product_id}-${item.days}-${item.start_date}-${Date.now()}`,
    };

    setCartItems(prev => [...prev, cartItem]);
  }

  function removeFromCart(cartItemId) {
    setCartItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
  }

  function updateCartItem(cartItemId, payload) {
    setCartItems(prev => prev.map(item => (
      item.cart_item_id === cartItemId ? { ...item, ...payload } : item
    )));
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, removeFromCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
}

