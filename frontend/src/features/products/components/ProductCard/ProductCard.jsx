import { Link } from "react-router-dom";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import "./ProductCard.css";

export default function ProductCard({ produto }) {
  const image = produto.images?.[0]?.url || "https://via.placeholder.com/600x400?text=Caixa+Magica";
  const activePrices = produto.pricing?.filter(item => item.is_active).map(item => Number(item.price)) || [];
  const lowestPrice = activePrices.length ? Math.min(...activePrices) : 0;

  return (
    <article className="produto-card">
      <img src={image} alt={produto.name} />
      <h3>{produto.name}</h3>
      <p>{produto.description}</p>

      <div className="bloco-prazo">
        <span className="titulo-prazo">Prazos disponíveis:</span>
        <div className="prazo-botoes">
          {produto.pricing?.filter(item => item.is_active).map(item => (
            <span className="prazo-btn" key={item.id}>{item.days} dias</span>
          ))}
        </div>
      </div>

      <p className="preco">
        <span>A partir de</span>
        <strong>{formatCurrency(lowestPrice)}</strong>
      </p>

      <Link className="btn-carrinho" to={`/produtos/${produto.id}`}>Ver detalhes</Link>
    </article>
  );
}
