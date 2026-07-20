import { apiClient } from "@/shared/api/apiClient";

export function getAdminOrders({ page = 1, limit = 10, status } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (status) params.set("status", status);

  return apiClient(`/usuarios/admin/pedidos?${params.toString()}`);
}

export function getAdminOrdersSummary() {
  return apiClient("/pedidos/admin/resumo");
}

export function getAdminUsers({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  return apiClient(`/usuarios/admin/usuarios?${params.toString()}`);
}

export function getAdminUsersSummary() {
  return apiClient("/usuarios/admin/usuarios/resumo");
}

export function getAdminUserById(userId) {
  return apiClient(`/usuarios/admin/usuarios/${userId}`);
}

export function createAdminUser(payload) {
  return apiClient("/usuarios/admin/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminUser(userId, payload) {
  return apiClient(`/usuarios/admin/usuarios/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminUser(userId) {
  return apiClient(`/usuarios/admin/usuarios/${userId}`, {
    method: "DELETE",
  });
}

export function updateAdminOrderStatus(orderId, payload) {
  return apiClient(`/pedidos/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createAdminProduct(payload) {
  return apiClient("/produtos/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAdminProducts() {
  return apiClient("/produtos/admin");
}

export function getAdminProductsSummary() {
  return apiClient("/produtos/admin/resumo");
}

export function createAdminCategory(payload) {
  return apiClient("/produtos/admin/categorias", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function uploadAdminProductImage(file) {
  const body = new FormData();
  body.append("image", file);

  return apiClient("/produtos/admin/upload-image", {
    method: "POST",
    body,
  });
}

export function updateAdminProduct(productId, payload) {
  return apiClient(`/produtos/admin/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAdminProductStatus(productId, payload) {
  return apiClient(`/produtos/admin/${productId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminProduct(productId) {
  return apiClient(`/produtos/admin/${productId}`, {
    method: "DELETE",
  });
}

export function expirePendingOrders() {
  return apiClient("/pedidos/admin/expirar", {
    method: "POST",
  });
}
