import { ApiError } from "./ApiError";
import { API_BASE_URL } from "./apiConfig";

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
    }

    throw new ApiError(data?.detail || data?.error?.message || "Erro ao comunicar com a API.", {
      status: response.status,
      data,
    });
  }

  return data;
}
