import { apiClient } from "@/shared/api/apiClient";

export function createSaleOrder(payload) {
  return apiClient("/pedidos/compra", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
