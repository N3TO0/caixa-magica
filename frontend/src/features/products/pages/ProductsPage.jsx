import { useState } from "react";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import ProductCard from "../components/ProductCard";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { filterProducts } from "../utils/productFilters";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const produtosFiltrados = filterProducts(products, { busca, categoria });

  return (
    <>
      <Hero
        title="Produtos"
        subtitle="Encontre brinquedos e itens infantis para alugar pelo período ideal."
      />

    <main className="produtos-page">
      <div className="produtos-toolbar">

      <input
        className="field-control"
        type="text"
        placeholder="Buscar produto..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <select className="field-control" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="Todos">Todas as categorias</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.slug}>{cat.name}</option>
        ))}
      </select>
      </div>

      {loading && <LoadingState message="Carregando produtos..." />}
      {error && <ErrorMessage message={error.message} />}

      {!loading && !error && produtosFiltrados.length === 0 && (
        <EmptyState title="Nenhum produto encontrado" />
      )}

      <div className="grid">
        {produtosFiltrados.map(produto => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </main>
    </>
  );
}
