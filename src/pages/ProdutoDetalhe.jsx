import { useParams } from "react-router-dom";
import { produtos } from "../data/Produtos";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FavoritesContext } from "../context/FavoritesContext";
import "../styles/produto.css";

function ProdutoDetalhe() {
  const { id } = useParams();
  const produto = produtos.find(p => p.id === Number(id));

  const [plano, setPlano] = useState("diaria");

  const { addToCart } = useContext(CartContext);
  const { toggleFavorite } = useContext(FavoritesContext);

  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div className="produto-page">

      <div className="produto-topo">

        <div className="galeria">
          <img src={produto.imagens[0]} alt={produto.nome} />
          <video controls src={produto.video}></video>
        </div>

        <div className="info">
          <h1>{produto.nome}</h1>
          <p>{produto.descricao}</p>

          <div className="avaliacao">
            ⭐ {produto.avaliacoes.reduce((a,b)=>a+b.nota,0)/produto.avaliacoes.length}
          </div>

          <div className="planos">
            {["diaria","sete","quinze","trinta"].map(p => (
              <button 
                key={p}
                className={plano === p ? "ativo" : ""}
                onClick={() => setPlano(p)}
              >
                {p === "diaria" && "1 dia"}
                {p === "sete" && "7 dias"}
                {p === "quinze" && "15 dias"}
                {p === "trinta" && "30 dias"}
              </button>
            ))}
          </div>

          <h2>R$ {produto.planos[plano]}</h2>

          <div className="acoes">
            <button onClick={() => addToCart(produto, plano)}>🛒 Carrinho</button>
            <button onClick={() => toggleFavorite(produto)}>❤️ Favorito</button>
            <button>📄 Alugar</button>
          </div>

        </div>
      </div>

      <div className="avaliacoes">
        <h3>Avaliações</h3>
        {produto.avaliacoes.map((a,i)=>(
          <p key={i}>⭐{a.nota} - {a.comentario}</p>
        ))}
      </div>

    </div>
  );
}

export default ProdutoDetalhe;