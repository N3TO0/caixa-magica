import { apiClient } from "@/shared/api/apiClient";

export function createAddress(payload) {
  return apiClient("/usuarios/me/enderecos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyAddresses() {
  return apiClient("/usuarios/me/enderecos");
}
