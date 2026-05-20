import { useParams } from "react-router-dom";
import produtos from "../data/Produtos.json";
import { useContext, useState } from "react";
import { useCart } from "../context/CartContext";
import { FavoritesContext } from "../context/FavoritesContext";
import Hero from "../components/Hero/Hero";
import "../styles/Produto.css";

function ProdutoDetalhe() {
  const { id } = useParams();
  const produto = produtos.find(p => p.id === Number(id));

  const [plano, setPlano] = useState("1dia");

  const { addToCart } = useCart();
  const { toggleFavorite } = useContext(FavoritesContext);

  if (!produto) return <p className="produto-nao-encontrado">Produto não encontrado</p>;

  return (
    <>
    <Hero title={produto.nome} subtitle="Escolha o prazo ideal e adicione o item ao seu carrinho." />
    <main className="produto-page">

      <div className="produto-topo">

        <div className="galeria">
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        <div className="info">
          <h1>{produto.nome}</h1>
          <p>{produto.descricao}</p>

          <div className="avaliacao">
            Categoria: {produto.categoria}
          </div>

          <div className="planos">
            {[
              { key: "1dia", label: "1 dia" },
              { key: "7dias", label: "7 dias" },
              { key: "15dias", label: "15 dias" },
              { key: "30dias", label: "30 dias" },
            ].map(p => (
              <button 
                key={p.key}
                className={plano === p.key ? "ativo" : ""}
                onClick={() => setPlano(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <h2>R$ {produto.precos[plano]}</h2>

          <div className="acoes">
            <button onClick={() => addToCart({ ...produto, prazo: plano, preco: produto.precos[plano] })}>Carrinho</button>
            <button onClick={() => toggleFavorite(produto)}>Favorito</button>
            <button>Alugar</button>
          </div>

        </div>
      </div>

    </main>
    </>
  );
}

export default ProdutoDetalhe;
