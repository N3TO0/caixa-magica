const CATEGORY_TO_AGE_RANGE = {
  "0-3-meses": "0-3 meses",
  "3-6-meses": "3-6 meses",
};

export function filterProducts(products, { busca, categoria }) {
  const searchTerm = busca.trim().toLowerCase();
  const ageRangeFilter = CATEGORY_TO_AGE_RANGE[categoria];

  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = categoria === "Todos" || (
      product.categories
        ? product.categories.some(item => item.slug === categoria)
        : product.age_range === ageRangeFilter
    );

    return matchesSearch && matchesCategory;
  });
}
