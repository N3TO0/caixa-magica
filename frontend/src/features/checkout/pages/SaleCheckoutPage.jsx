import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getDeliveryTypeLabel, getPaymentTypeLabel } from "@/shared/utils/orderLabelUtils";
import { createAddress, getMyAddresses } from "@/features/account/api/addressApi";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import { useSaleCart } from "@/features/saleCart/hooks/useSaleCart";
import { useSaleCheckout } from "../hooks/useSaleCheckout";
import { buildSaleOrderPayload } from "../utils/saleOrderPayload";
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
  accept_terms: false,
};

export default function SaleCheckoutPage() {
  const [form, setForm] = useState(initialForm);
  const [inlineError, setInlineError] = useState("");
  const [addresses, setAddresses] = useState([]);

  const { saleCartItems, clearSaleCart, removeSaleItem, updateSaleItem } = useSaleCart();
  const { error, loading, submitSaleOrder } = useSaleCheckout();
  const navigate = useNavigate();

  const total = useMemo(
    () => saleCartItems.reduce((sum, item) => sum + Number(item.sale_price || 0) * Number(item.quantity || 1), 0),
    [saleCartItems]
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
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setInlineError("");

    if (saleCartItems.length === 0) {
      setInlineError("Adicione pelo menos um produto de compra.");
      return;
    }

    if (!form.accept_terms) {
      setInlineError("E necessario aceitar os termos para enviar a compra.");
      return;
    }

    try {
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
            label: "Entrega compra",
            is_default: false,
          });

          addressId = address.id;
        }
      }

      const payload = buildSaleOrderPayload({
        saleCartItems,
        form: { ...form, address_id: addressId },
      });

      const response = await submitSaleOrder(payload);
      clearSaleCart();
      notifySuccess("Pedido de compra enviado com sucesso.");
      navigate(`/pedido/sucesso/${response.data.id}`, {
        state: { ...response.data, mode: "sale" },
      });
    } catch (err) {
      const message = err.message || "Nao foi possivel finalizar a compra.";
      setInlineError(message);
      notifyError(message);
    }
  }

  return (
    <>
      <Hero title="Checkout de compra" subtitle="Revise os itens de venda e finalize sua solicitacao." />
      <main className="checkout-page">
        <section className="checkout-card checkout-summary">
          <div className="checkout-summary__header">
            <div>
              <p className="checkout-section__eyebrow">Resumo da compra</p>
              <h2>Confira seus produtos</h2>
              <span className="checkout-summary__description">Este fluxo e exclusivo para produtos de venda, sem prazo de locacao.</span>
            </div>
          </div>

          {saleCartItems.length === 0 ? (
            <div className="checkout-empty-state">
              <p className="checkout-empty">Nenhum produto de compra foi adicionado.</p>
              <Link to="/produtos" className="primary-button checkout-empty-state__link">Explorar produtos</Link>
            </div>
          ) : (
            <div className="checkout-items">
              {saleCartItems.map((item) => (
                <article className="checkout-item" key={item.cart_item_id}>
                  <img src={item.image_url} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Compra avulsa</p>
                    <label>
                      Quantidade
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateSaleItem(item.cart_item_id, { quantity: Math.max(1, Number(event.target.value || 1)) })}
                      />
                    </label>
                    <strong>{formatCurrency(Number(item.sale_price || 0) * Number(item.quantity || 1))}</strong>
                  </div>
                  <button type="button" onClick={() => removeSaleItem(item.cart_item_id)}>Remover</button>
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
              <span>Escolha como deseja receber os produtos comprados e como pretende pagar.</span>
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
          </section>

          <section className={`checkout-form-section ${form.delivery_type !== "delivery" ? "checkout-form-section--muted" : ""}`}>
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 2</p>
              <h2>Endereco</h2>
              <span>{form.delivery_type === "delivery" ? "Informe um endereco para entrega ou selecione um endereco salvo." : "Retirada em loja nao exige endereco para este pedido."}</span>
            </div>

            {form.delivery_type === "delivery" && addresses.length > 0 ? (
              <label>
                Endereco salvo
                <select value={form.selected_address_id} onChange={(e) => updateForm("selected_address_id", e.target.value)}>
                  <option value="">Cadastrar novo endereco</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>{address.street}, {address.number} - {address.city}/{address.state}</option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="checkout-form-section__grid checkout-form-section__grid--two-columns">
              <label>
                CEP *
                <input value={form.zip_code} onChange={(e) => updateForm("zip_code", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Rua *
                <input value={form.street} onChange={(e) => updateForm("street", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Numero *
                <input value={form.number} onChange={(e) => updateForm("number", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Complemento
                <input value={form.complement} onChange={(e) => updateForm("complement", e.target.value)} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Bairro *
                <input value={form.neighborhood} onChange={(e) => updateForm("neighborhood", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Cidade *
                <input value={form.city} onChange={(e) => updateForm("city", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
              <label>
                Estado *
                <input value={form.state} onChange={(e) => updateForm("state", e.target.value)} required={form.delivery_type === "delivery" && !form.selected_address_id} disabled={form.delivery_type !== "delivery" || Boolean(form.selected_address_id)} />
              </label>
            </div>
          </section>

          <section className="checkout-form-section">
            <div className="checkout-form-section__header">
              <p className="checkout-section__eyebrow">Etapa 3</p>
              <h2>Observacoes e confirmacao</h2>
              <span>Revise a compra e confirme os termos antes de enviar a solicitacao.</span>
            </div>
            <label>
              Observacoes
              <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} placeholder="Informacoes adicionais" />
            </label>
            <div className="checkout-terms-box">
              <Link to="/contrato" target="_blank" className="checkout-terms-link">Visualizar termo</Link>
              <label className="checkout-terms">
                <input type="checkbox" checked={form.accept_terms} onChange={(e) => updateForm("accept_terms", e.target.checked)} />
                Li e aceito os termos para envio desta compra.
              </label>
            </div>

            <div className="checkout-callout checkout-callout--success">
              Nossa equipe vai confirmar a compra e combinar a retirada ou entrega do pedido com voce.
            </div>

            {inlineError ? <p className="checkout-inline-error">{inlineError}</p> : null}
            {error && !inlineError ? <ErrorMessage message={error.message} /> : null}

            <button className="checkout-submit" type="submit" disabled={loading || saleCartItems.length === 0}>
              {loading ? "Finalizando..." : "Finalizar compra"}
            </button>
          </section>
        </form>
      </main>
    </>
  );
}
