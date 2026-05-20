import { ApiError } from "@/shared/errors/ApiError";
import { API_BASE_URL } from "./apiConfig";

export async function apiClient(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(data?.detail || data?.error?.message || "Erro ao comunicar com a API.", {
      status: response.status,
      data,
    });
  }

  return data;
}
