import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { createMockOrder, getMockOrderById } from "./ordersMock";

export function createOrder(payload) {
  if (USE_MOCKS.orders) return createMockOrder(payload);

  return apiClient("/pedidos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrderById(orderId) {
  if (USE_MOCKS.orders) return getMockOrderById(orderId);

  return apiClient(`/pedidos/${orderId}`);
}
