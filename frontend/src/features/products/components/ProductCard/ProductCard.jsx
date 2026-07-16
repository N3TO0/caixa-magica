import { Link } from "react-router-dom";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { formatAvailableUnits, getAvailabilityHighlight, getAvailabilityTone } from "@/shared/utils/availabilityUtils";
import "./ProductCard.css";

export default function ProductCard({ produto }) {
  const image = produto.images?.[0]?.url || "https://via.placeholder.com/600x400?text=Caixa+Magica";
  const activePrices = produto.pricing?.filter(item => item.is_active).map(item => Number(item.price)) || [];
  const lowestPrice = activePrices.length ? Math.min(...activePrices) : 0;
  const primaryCategory = produto.categories?.[0]?.name || "Catalogo infantil";
  const availabilityTone = getAvailabilityTone(produto.available_units);
  const isSale = produto.type === "sale";

  return (
    <article className="produto-card">
      <div className={`produto-card__stock produto-card__stock--${availabilityTone}`}>{getAvailabilityHighlight(produto.available_units)}</div>
      <img src={image} alt={produto.name} />
      <span className="produto-card__category">{primaryCategory}</span>
      <h3>{produto.name}</h3>
      <p>{produto.description}</p>

      {produto.age_range ? <span className="produto-card__age-range">{produto.age_range}</span> : null}

      {!isSale ? (
        <div className="bloco-prazo">
          <span className="titulo-prazo">Prazos disponíveis:</span>
          <div className="prazo-botoes">
            {produto.pricing?.filter(item => item.is_active).map(item => (
              <span className="prazo-btn" key={item.id}>{item.days} dias</span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="preco">
        <span>{isSale ? "Valor de venda" : "A partir de"}</span>
        <strong>{formatCurrency(isSale ? Number(produto.sale_price || 0) : lowestPrice)}</strong>
      </p>

      <p className="produto-disponibilidade">
        {formatAvailableUnits(produto.available_units)}
      </p>

      <Link className="btn-carrinho" to={`/produtos/${produto.id}`}>{isSale ? "Ver detalhes do produto" : "Ver detalhes e alugar"}</Link>
    </article>
  );
}
