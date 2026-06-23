import { apiClient } from "@/shared/api/apiClient";

export function getAdminOrders({ page = 1, limit = 10, status } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (status) params.set("status", status);

  return apiClient(`/usuarios/admin/pedidos?${params.toString()}`);
}

export function getAdminUsers({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  return apiClient(`/usuarios/admin/usuarios?${params.toString()}`);
}

export function updateAdminOrderStatus(orderId, payload) {
  return apiClient(`/pedidos/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
