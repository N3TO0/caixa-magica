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

const isMockEnabled = (key, defaultValue) => {
  const envValue = import.meta.env[`VITE_MOCK_${key}`];
  return envValue !== undefined ? envValue !== "false" : defaultValue;
};

export const USE_MOCKS = {
  products: isMockEnabled("PRODUCTS", false),
  categories: isMockEnabled("CATEGORIES", false),
  auth: isMockEnabled("AUTH", true),
  users: isMockEnabled("USERS", true),
  orders: isMockEnabled("ORDERS", false),
};
