import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { getMockCategories, getMockProductById, getMockProducts } from "./productsMock";

export function getProducts() {
  if (USE_MOCKS) return getMockProducts();
  return apiClient("/produtos/");
}

export function getCategories() {
  if (USE_MOCKS) return getMockCategories();
  return apiClient("/produtos/categorias");
}

export function getProductById(productId) {
  if (USE_MOCKS) return getMockProductById(productId);
  return apiClient(`/produtos/${productId}`);
}
