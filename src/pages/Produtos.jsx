import { useState } from "react";
import produtosData from "../data/Produtos.json";
import ProductCard from "../components/ProdutoCard";
import Hero from "../shared/components/Hero";
import "./Produtos.css";

export default function Produtos() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const categorias = ["Todos", ...new Set(produtosData.map(p => p.categoria))];

  const produtosFiltrados = produtosData.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      categoria === "Todos" || produto.categoria === categoria;
    return matchBusca && matchCategoria;
  });

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
