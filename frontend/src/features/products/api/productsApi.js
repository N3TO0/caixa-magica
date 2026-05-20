import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { getMockCategories, getMockProductById, getMockProducts } from "./productsMock";

export function getProducts() {
  if (USE_MOCKS.products) return getMockProducts();
  return apiClient("/produtos/");
}

export function getCategories() {
  if (USE_MOCKS.categories) return getMockCategories();
  return apiClient("/produtos/categorias");
}

export function getProductById(productId) {
  if (USE_MOCKS.products) return getMockProductById(productId);
  return apiClient(`/produtos/${productId}`);
}
