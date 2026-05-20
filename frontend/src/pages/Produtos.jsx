import { useState } from "react";
import produtosData from "../data/Produtos.json";
import ProductCard from "../components/ProdutoCard";
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
    <div>
      <h1>Produtos</h1>

      {/* BUSCA */}
      <input
        type="text"
        placeholder="Buscar produto..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* FILTRO */}
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        {categorias.map(cat => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      {/* LISTA */}
      <div className="grid">
        {produtosFiltrados.map(produto => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}