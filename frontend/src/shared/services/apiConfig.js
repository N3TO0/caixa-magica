export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

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
