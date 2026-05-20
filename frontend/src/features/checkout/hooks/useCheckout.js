import { useState } from "react";
import { createOrder } from "../api/ordersApi";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitOrder(payload) {
    try {
      setLoading(true);
      setError(null);
      return await createOrder(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, submitOrder };
}
