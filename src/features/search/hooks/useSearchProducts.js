import { filterProducts } from "@/features/products/utils/productFilters";
import { useProducts } from "@/features/products/hooks/useProducts";

export function useSearchProducts(term) {
  const { error, loading, products } = useProducts();
  const results = filterProducts(products, { busca: term || "", categoria: "Todos" });

  return { error, loading, results };
}
