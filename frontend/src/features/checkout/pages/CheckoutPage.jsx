import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import { useCart } from "@/features/cart/hooks/useCart";
import { getCartTotal } from "@/features/cart/utils/cartTotals";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { useCheckout } from "../hooks/useCheckout";
import { buildOrderPayload } from "../utils/orderPayload";
import "../styles/CheckoutPage.css";

const initialForm = {
  delivery_type: "pickup",
  payment_type: "pending",
  address_id: "1",
  notes: "",
  baby_name: "",
  baby_birthdate: "",
};

export default function CheckoutPage() {
  const [form, setForm] = useState(initialForm);
  const [inlineError, setInlineError] = useState("");
  const { cartItems, clearCart, removeFromCart } = useCart();
  const { error, loading, submitOrder } = useCheckout();
  const navigate = useNavigate();

  const total = getCartTotal(cartItems);

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setInlineError("");

    if (cartItems.length === 0) {
      setInlineError("Adicione pelo menos um produto ao carrinho antes de finalizar.");
      return;
    }

    try {
      const payload = buildOrderPayload({ cartItems, form });
      const response = await submitOrder(payload);
      clearCart();
      navigate(`/pedido/sucesso/${response.data.id}`, { state: response.data });
    } catch (err) {
      if (err.status === 400) {
        setInlineError(err.message);
      }
    }
  }

  return (
    <>
      <Hero title="Checkout" subtitle="Revise os itens e finalize sua solicitação de aluguel." />

      <main className="checkout-page">
        <section className="checkout-card checkout-summary">
          <h2>Resumo do pedido</h2>

          {cartItems.length === 0 ? (
            <p className="checkout-empty">Seu carrinho está vazio. <Link to="/produtos">Ver produtos</Link></p>
          ) : (
            <div className="checkout-items">
              {cartItems.map(item => (
                <article className="checkout-item" key={item.cart_item_id}>
                  <img src={item.image_url} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.days} dias • {item.start_date} até {item.end_date}</p>
                    <strong>{formatCurrency(item.price_snapshot)}</strong>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.cart_item_id)}>Remover</button>
                </article>
              ))}
            </div>
          )}

          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </section>

        <form className="checkout-card checkout-form" onSubmit={handleSubmit}>
          <h2>Dados da solicitação</h2>

          <label>
            Forma de recebimento
            <select value={form.delivery_type} onChange={(event) => updateForm("delivery_type", event.target.value)}>
              <option value="pickup">Retirada na loja</option>
              <option value="delivery">Entrega</option>
            </select>
          </label>

          <label>
            Pagamento
            <select value={form.payment_type} onChange={(event) => updateForm("payment_type", event.target.value)}>
              <option value="pending">A combinar</option>
              <option value="on_delivery_cash">Dinheiro na entrega</option>
              <option value="on_delivery_card">Cartão na entrega</option>
            </select>
          </label>

          {form.delivery_type === "delivery" && (
            <label>
              Endereço mockado
              <input value={form.address_id} onChange={(event) => updateForm("address_id", event.target.value)} />
            </label>
          )}

          <label>
            Nome da criança
            <input value={form.baby_name} onChange={(event) => updateForm("baby_name", event.target.value)} placeholder="Opcional" />
          </label>

          <label>
            Data de nascimento
            <input type="date" value={form.baby_birthdate} onChange={(event) => updateForm("baby_birthdate", event.target.value)} />
          </label>

          <label>
            Observações
            <textarea value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Ex.: melhor horário para contato" />
          </label>

          {inlineError && <p className="checkout-inline-error">{inlineError}</p>}
          {error && !inlineError && <ErrorMessage message={error.message} />}

          <button className="checkout-submit" type="submit" disabled={loading || cartItems.length === 0}>
            {loading ? "Finalizando..." : "Finalizar pedido"}
          </button>
        </form>
      </main>
    </>
  );
}
