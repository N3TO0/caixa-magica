import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import { useCart } from "@/features/cart/hooks/useCart";
import { getCartTotal } from "@/features/cart/utils/cartTotals";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getDeliveryTypeLabel, getPaymentTypeLabel } from "@/shared/utils/orderLabelUtils";
import { useCheckout } from "../hooks/useCheckout";
import { buildOrderPayload } from "../utils/orderPayload";
import { createAddress, getMyAddresses } from "@/features/account/api/addressApi";
import { checkProductAvailability } from "../api/availabilityApi";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import "../styles/CheckoutPage.css";

const initialForm = {
  zip_code: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  selected_address_id: "",
  delivery_type: "pickup",
  payment_type: "pending",
  notes: "",
  baby_name: "",
  baby_birthdate: "",
  accept_terms: false,
};

export default function CheckoutPage() {
  const [form, setForm] = useState(initialForm);
  const [inlineError, setInlineError] = useState("");
  const [addresses, setAddresses] = useState([]);

  const { cartItems, clearCart, removeFromCart } = useCart();
  const { error, loading, submitOrder } = useCheckout();
  const navigate = useNavigate();

  const total = getCartTotal(cartItems);
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cartItems]
  );

  useEffect(() => {
    let active = true;

    async function loadAddresses() {
      try {
        const data = await getMyAddresses();
        if (active) setAddresses(Array.isArray(data) ? data : []);
      } catch {
        if (active) setAddresses([]);
      }
    }

    loadAddresses();

    return () => {
      active = false;
    };
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setInlineError("");

    if (cartItems.length === 0) {
      setInlineError("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    if (!form.accept_terms) {
      setInlineError("E necessario aceitar os termos de locacao.");
      return;
    }

    try {
      for (const item of cartItems) {
        const availability = await checkProductAvailability(item.product_id, {
          startDate: item.start_date,
          endDate: item.end_date,
        });

        if (!availability.data?.disponivel || Number(availability.data?.unidades_livres || 0) < Number(item.quantity || 1)) {
          setInlineError(`${item.name} nao esta disponivel no periodo selecionado.`);
          return;
        }
      }

      let addressId = null;

      if (form.delivery_type === "delivery") {
        if (form.selected_address_id) {
          addressId = Number(form.selected_address_id);
        } else {
          const address = await createAddress({
            zip_code: form.zip_code,
            street: form.street,
            number: form.number,
            complement: form.complement || null,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            label: "Entrega",
            is_default: false,
          });

          addressId = address.id;
        }
      }

      const payload = buildOrderPayload({
        cartItems,
        form: { ...form, address_id: addressId },
      });

      const response = await submitOrder(payload);

      clearCart();
      notifySuccess("Pedido enviado com sucesso.");
      navigate(`/pedido/sucesso/${response.data.id}`, { state: response.data });
    } catch (err) {
      const message = err.message || "Nao foi possivel finalizar a solicitacao.";
      setInlineError(message);
      notifyError(message);
    }
  }

  return (
    <>
      <Hero title="Checkout" subtitle="Revise seus dados e finalize sua solicitacao." />

      <main className="checkout-page">
        <section className="checkout-card checkout-summary">
          <div className="checkout-summary__header">
            <div>
              <p className="checkout-section__eyebrow">Resumo do pedido</p>
              <h2>Confira sua locacao</h2>
            </div>

            <div className="checkout-summary__badge">
              <strong>{totalItems}</strong>
              <span>{totalItems === 1 ? "item" : "itens"}</span>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="checkout-empty-state">
              <p className="checkout-empty">Seu carrinho esta vazio no momento.</p>
              <Link to="/produtos" className="primary-button checkout-empty-state__link">
                Explorar produtos
              </Link>
            </div>
          ) : (
            <div className="checkout-items">
              {cartItems.map((item) => (
                <article className="checkout-item" key={item.cart_item_id}>
                  <img src={item.image_url} alt={item.name} />

                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.quantity} unidade(s)</p>
                    <p>Locacao por {item.days} dias</p>
                    <p>{item.start_date} ate {item.end_date}</p>
                    <strong>{formatCurrency(item.price_snapshot)}</strong>
                  </div>

                  <button type="button" onClick={() => removeFromCart(item.cart_item_id)}>
                    Remover
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="checkout-summary__meta-grid">
            <div>
              <span>Recebimento</span>
              <strong>{getDeliveryTypeLabel(form.delivery_type)}</strong>
            </div>
            <div>
              <span>Pagamento</span>
              <strong>{getPaymentTypeLabel(form.payment_type)}</strong>
            </div>
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </section>

        <form className="checkout-card checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-form-section">
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 1</p>
              <h2>Recebimento e pagamento</h2>
              <span>Defina como voce quer receber os itens e como pretende pagar.</span>
            </div>

            <div className="checkout-form-section__grid checkout-form-section__grid--two-columns">
              <label>
                Forma de recebimento
                <select value={form.delivery_type} onChange={(e) => updateForm("delivery_type", e.target.value)}>
                  <option value="pickup">{getDeliveryTypeLabel("pickup")}</option>
                  <option value="delivery">{getDeliveryTypeLabel("delivery")}</option>
                </select>
              </label>

              <label>
                Forma de pagamento
                <select value={form.payment_type} onChange={(e) => updateForm("payment_type", e.target.value)}>
                  <option value="pending">{getPaymentTypeLabel("pending")}</option>
                  <option value="on_delivery_card">{getPaymentTypeLabel("on_delivery_card")}</option>
                  <option value="on_delivery_cash">{getPaymentTypeLabel("on_delivery_cash")}</option>
                </select>
              </label>
            </div>

            <div className="checkout-callout">
              {form.delivery_type === "delivery"
                ? "Voce podera usar um endereco salvo ou cadastrar um novo endereco para entrega."
                : "Na retirada em loja, nossa equipe confirmara com voce os proximos passos apos o envio do pedido."}
            </div>
          </section>

          <section className={`checkout-form-section ${form.delivery_type !== "delivery" ? "checkout-form-section--muted" : ""}`}>
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 2</p>
              <h2>Endereco</h2>
              <span>
                {form.delivery_type === "delivery"
                  ? "Informe onde deseja receber os produtos ou escolha um endereco ja salvo."
                  : "Endereco nao e necessario para retirada na loja."}
              </span>
            </div>

            {form.delivery_type === "delivery" && addresses.length > 0 ? (
              <label>
                Endereco salvo
                <select value={form.selected_address_id} onChange={(e) => updateForm("selected_address_id", e.target.value)}>
                  <option value="">Cadastrar novo endereco</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.number} - {address.city}/{address.state}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="checkout-form-section__grid checkout-form-section__grid--two-columns">
              <label>
                CEP *
                <input
                  value={form.zip_code}
                  onChange={(e) => updateForm("zip_code", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Rua *
                <input
                  value={form.street}
                  onChange={(e) => updateForm("street", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Numero *
                <input
                  value={form.number}
                  onChange={(e) => updateForm("number", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Complemento
                <input
                  value={form.complement}
                  onChange={(e) => updateForm("complement", e.target.value)}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Bairro *
                <input
                  value={form.neighborhood}
                  onChange={(e) => updateForm("neighborhood", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Cidade *
                <input
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>

              <label>
                Estado *
                <input
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  required={form.delivery_type === "delivery" && !form.selected_address_id}
                  disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)}
                />
              </label>
            </div>
          </section>

          <section className="checkout-form-section">
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 3</p>
              <h2>Dados adicionais</h2>
              <span>Se quiser, informe dados da crianca e observacoes para personalizar melhor o atendimento.</span>
            </div>

            <div className="checkout-form-section__grid checkout-form-section__grid--two-columns">
              <label>
                Nome da crianca
                <input type="text" value={form.baby_name} onChange={(e) => updateForm("baby_name", e.target.value)} />
              </label>

              <label>
                Data de nascimento / aniversario
                <input type="date" value={form.baby_birthdate} onChange={(e) => updateForm("baby_birthdate", e.target.value)} />
              </label>
            </div>

            <label>
              Observacoes
              <textarea
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                placeholder="Informacoes adicionais"
              />
            </label>

            <p className="checkout-helper-text">Seus dados principais de contato serao considerados a partir da conta utilizada no login.</p>
          </section>

          <section className="checkout-form-section">
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 4</p>
              <h2>Confirmacao</h2>
              <span>Revise tudo e confirme os termos de locacao antes de enviar.</span>
            </div>

            <div className="checkout-terms-box">
              <Link to="/contrato" target="_blank" className="checkout-terms-link">
                Visualizar termo de locacao
              </Link>

              <label className="checkout-terms">
                <input type="checkbox" checked={form.accept_terms} onChange={(e) => updateForm("accept_terms", e.target.checked)} />
                Li e aceito os termos de locacao.
              </label>
            </div>

            <div className="checkout-callout checkout-callout--success">
              Depois do envio, nossa equipe fara a confirmacao do pedido e combinara retirada ou entrega com voce.
            </div>

            {inlineError ? <p className="checkout-inline-error">{inlineError}</p> : null}
            {error && !inlineError ? <ErrorMessage message={error.message} /> : null}

            <button className="checkout-submit" type="submit" disabled={loading || cartItems.length === 0}>
              {loading ? "Finalizando..." : "Finalizar solicitacao"}
            </button>
          </section>
        </form>
      </main>
    </>
  );
}
