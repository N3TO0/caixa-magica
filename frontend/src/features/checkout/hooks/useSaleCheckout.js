import { useState } from "react";
import { createSaleOrder } from "../api/saleOrdersApi";

export function useSaleCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitSaleOrder(payload) {
    try {
      setLoading(true);
      setError(null);
      return await createSaleOrder(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, submitSaleOrder };
}
