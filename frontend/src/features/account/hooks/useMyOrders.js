import { useEffect, useState } from "react";
import { getMyOrders } from "../api/accountApi";

export function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const response = await getMyOrders();
        if (active) setOrders(response.data || []);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  return { error, loading, orders };
}
