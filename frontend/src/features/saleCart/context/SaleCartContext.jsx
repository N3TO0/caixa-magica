import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = "sale_cart_items";

export const SaleCartContext = createContext();

function readStoredItems() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SaleCartProvider({ children }) {
  const [saleCartItems, setSaleCartItems] = useState(() => readStoredItems());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saleCartItems));
  }, [saleCartItems]);

  function addSaleItem(item) {
    setSaleCartItems((prev) => {
      const existing = prev.find((current) => current.product_id === item.product_id);
      if (existing) {
        return prev.map((current) =>
          current.product_id === item.product_id
            ? { ...current, quantity: current.quantity + (item.quantity || 1) }
            : current
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1,
          cart_item_id: item.cart_item_id || `${item.product_id}-${Date.now()}`,
        },
      ];
    });
  }

  function removeSaleItem(cartItemId) {
    setSaleCartItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
  }

  function updateSaleItem(cartItemId, payload) {
    setSaleCartItems((prev) =>
      prev.map((item) =>
        item.cart_item_id === cartItemId ? { ...item, ...payload } : item
      )
    );
  }

  function clearSaleCart() {
    setSaleCartItems([]);
  }

  return (
    <SaleCartContext.Provider
      value={{ saleCartItems, addSaleItem, removeSaleItem, updateSaleItem, clearSaleCart }}
    >
      {children}
    </SaleCartContext.Provider>
  );
}
