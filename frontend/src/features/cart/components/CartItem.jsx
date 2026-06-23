import { formatCurrency } from "@/shared/utils/moneyUtils";

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateDays,
}) {
  return (
    <article className="cart-item">

      <img
        src={item.image_url}
        alt={item.name}
        className="cart-item-image"
      />

      <div className="cart-item-info">
        <h3>{item.name}</h3>

        <p>Quantidade: {item.quantity}</p>

        <p>Locação: {item.days} dias</p>

        <p>
          Início: {item.start_date} <br />
          Fim: {item.end_date}
        </p>

        <strong>
          {formatCurrency(Number(item.price_snapshot || 0) * Number(item.quantity || 1))}
        </strong>
      </div>

      <div className="cart-item-actions">

        {/* QUANTIDADE */}
        <div className="quantity-control">
          <button onClick={() =>
            onUpdateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))
          }>
            -
          </button>

          <span>{item.quantity}</span>

          <button onClick={() =>
            onUpdateQuantity(item.cart_item_id, item.quantity + 1)
          }>
            +
          </button>
        </div>

        {/* PRAZO */}
        <select
          value={item.days}
          onChange={(e) =>
            onUpdateDays(item.cart_item_id, Number(e.target.value))
          }
        >
          <option value={7}>7 dias</option>
          <option value={15}>15 dias</option>
          <option value={30}>30 dias</option>
        </select>

        {/* REMOVER */}
        <button className="remove-btn" onClick={() => onRemove(item.cart_item_id)}>
          Remover
        </button>

      </div>
    </article>
  );
}
