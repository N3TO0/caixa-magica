import { apiClient } from "@/shared/api/apiClient";

export function createOrder(payload) {
  return apiClient("/pedidos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrderById(orderId) {
  return apiClient(`/pedidos/${orderId}`);
}

