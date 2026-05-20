import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

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

