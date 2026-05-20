import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { getMockAccount, getMockMyOrders, getMockOrderDetail } from "./accountMock";

export function getAccount() {
  if (USE_MOCKS) return getMockAccount();
  return apiClient("/usuarios/me");
}

export function getMyOrders() {
  if (USE_MOCKS) return getMockMyOrders();
  return apiClient("/usuarios/me/pedidos");
}

export function getOrderDetail(orderId) {
  if (USE_MOCKS) return getMockOrderDetail(orderId);
  return apiClient(`/pedidos/${orderId}`);
}
