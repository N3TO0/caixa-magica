import { useState } from "react";
import { useCart } from "../../../cart/hooks/useCart";
import "./ProductCard.css";

export default function ProductCard({ produto }) {
  const { addToCart } = useCart();
  const [prazo, setPrazo] = useState("1dia");

  const prazos = [
    { key: "1dia", label: "01 dia" },
    { key: "7dias", label: "07 dias" },
    { key: "15dias", label: "15 dias" },
    { key: "30dias", label: "30 dias" },
  ];

  return (
    <article className="produto-card">
      <img src={produto.imagem} alt={produto.nome} />
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>

      <div className="bloco-prazo">
  <span className="titulo-prazo">⏱ Escolha o prazo de aluguel:</span>

  <div className="prazo-botoes">
    {prazos.map(p => (
      <button
        key={p.key}
        className={`prazo-btn ${prazo === p.key ? "ativo" : ""}`}
        onClick={() => setPrazo(p.key)}
      >
        {p.label}
      </button>
    ))}
  </div>
</div>

      {/* PREÇO */}
      <p className="preco">
        <strong>R$ {produto.precos[prazo]}</strong>
      </p>

      <button
        className="btn-carrinho"
        onClick={() =>
          addToCart({
            ...produto,
            prazo,
            preco: produto.precos[prazo],
          })
        }
      >
        Adicionar ao carrinho
      </button>
    </article>
  );
}
