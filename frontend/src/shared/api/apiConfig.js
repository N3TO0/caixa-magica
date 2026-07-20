function buildApiBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (apiUrl) {
    const base = apiUrl.replace(/\/$/, "");
    return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:8000/api/v1";
  }

  return "/api/v1";
}

export const API_BASE_URL = buildApiBaseUrl();
