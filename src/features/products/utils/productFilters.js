export function filterProducts(products, { busca, categoria }) {
  const searchTerm = busca.trim().toLowerCase();

  return products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm);
    const matchesCategory = categoria === "Todos" || product.categoria === categoria;

    return matchesSearch && matchesCategory;
  });
}
