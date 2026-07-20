import { apiClient } from "@/shared/api/apiClient";

export function checkProductAvailability(productId, { startDate, endDate }) {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  return apiClient(`/pedidos/disponibilidade/${productId}?${params.toString()}`);
}
