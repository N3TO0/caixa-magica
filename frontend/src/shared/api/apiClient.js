import { ApiError } from "./ApiError";
import { API_BASE_URL } from "./apiConfig";

function dispatchWindowEvent(name) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
}

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");
  let response;
  const isFormData = options.body instanceof FormData;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Tente novamente.", {
      status: 0,
    });
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("auth_token");
      dispatchWindowEvent("auth:unauthorized");
    }

    throw new ApiError(data?.detail || data?.error?.message || "Erro ao comunicar com a API.", {
      status: response.status,
      data,
    });
  }

  return data;
}
