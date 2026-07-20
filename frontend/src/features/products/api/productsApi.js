import { apiClient } from "@/shared/api/apiClient";

export function getProducts() {
  return apiClient("/produtos/");
}

export function getCategories() {
  return apiClient("/produtos/categorias");
}

export function getProductById(productId) {
  return apiClient(`/produtos/${productId}`);
}
