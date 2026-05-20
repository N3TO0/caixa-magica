import { useState } from "react";
import Hero from "@/shared/components/Hero";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productsService";
import { filterProducts } from "../utils/productFilters";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const produtos = getProducts();
  const categorias = ["Todos", ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = filterProducts(produtos, { busca, categoria });

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
        {categorias.map(cat => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
      </div>

      <div className="grid">
        {produtosFiltrados.map(produto => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </main>
    </>
  );
}
