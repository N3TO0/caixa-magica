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
          R$ {(item.price_snapshot * item.quantity * (item.days / 7)).toFixed(2)}
        </strong>
      </div>

      <div className="cart-item-actions">

        {/* QUANTIDADE */}
        <div className="quantity-control">
          <button onClick={() =>
            onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))
          }>
            -
          </button>

          <span>{item.quantity}</span>

          <button onClick={() =>
            onUpdateQuantity(item.product_id, item.quantity + 1)
          }>
            +
          </button>
        </div>

        {/* PRAZO */}
        <select
          value={item.days}
          onChange={(e) =>
            onUpdateDays(item.product_id, Number(e.target.value))
          }
        >
          <option value={7}>7 dias</option>
          <option value={15}>15 dias</option>
          <option value={30}>30 dias</option>
        </select>

        {/* REMOVER */}
        <button className="remove-btn" onClick={() => onRemove(item.product_id)}>
          Remover
        </button>

      </div>
    </article>
  );
}