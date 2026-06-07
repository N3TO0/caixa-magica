import { Link } from "react-router-dom";

export default function CartSummary({ itemCount = 0, total = 0 }) {
  const safeTotal = Number(total) || 0;

  return (
    <aside className="cart-summary">
      <h2>Resumo do Pedido</h2>

      <div className="summary-row">
        <span>Itens</span>
        <strong>{itemCount}</strong>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>R$ {safeTotal.toFixed(2)}</strong>
      </div>

      <div className="summary-row total">
        <span>Total</span>
        <strong>R$ {safeTotal.toFixed(2)}</strong>
      </div>

      <Link to="/checkout" className="checkout-btn">
        Finalizar pedido
      </Link>
    </aside>
  );
}