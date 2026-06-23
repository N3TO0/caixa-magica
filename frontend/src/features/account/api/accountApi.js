import { apiClient } from "@/shared/api/apiClient";

export function getAccount() {
  return apiClient("/usuarios/me");
}

export function getMyOrders() {
  return apiClient("/usuarios/me/pedidos");
}

export function getOrderDetail(orderId) {
  return apiClient(`/pedidos/${orderId}`);
}

export function updateProfile(payload) {
  return apiClient("/usuarios/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

