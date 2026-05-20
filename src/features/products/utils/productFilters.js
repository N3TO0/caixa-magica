export function filterProducts(products, { busca, categoria }) {
  const searchTerm = busca.trim().toLowerCase();

  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = categoria === "Todos" || product.categories?.some(item => item.slug === categoria);

    return matchesSearch && matchesCategory;
  });
}
