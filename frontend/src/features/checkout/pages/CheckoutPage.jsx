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
  // Cliente
  customer_name: "",
  customer_birthdate: "",
  customer_cpf: "",
  customer_gender: "",
  customer_phone: "",
  customer_email: "",

  // Endereço
  zip_code: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",

  // Pedido
  delivery_type: "pickup",
  payment_type: "pix",
  notes: "",

  // Criança (opcional)
  baby_name: "",
  baby_birthdate: "",

  // Termo
  accept_terms: false,
};

export default function CheckoutPage() {
  const [form, setForm] = useState(initialForm);
  const [inlineError, setInlineError] = useState("");

  const { cartItems, clearCart, removeFromCart } = useCart();
  const { error, loading, submitOrder } = useCheckout();

  const navigate = useNavigate();

  const total = getCartTotal(cartItems);

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
      setInlineError(
        "Adicione pelo menos um produto ao carrinho."
      );
      return;
    }

    if (!form.accept_terms) {
      setInlineError(
        "É necessário aceitar os termos de locação."
      );
      return;
    }

    try {
      const payload = buildOrderPayload({
        cartItems,
        form,
      });

      const response = await submitOrder(payload);

      clearCart();

      navigate(
        `/pedido/sucesso/${response.data.id}`,
        {
          state: response.data,
        }
      );
    } catch (err) {
      if (err.status === 400) {
        setInlineError(err.message);
      }
    }
  }

  return (
    <>
      <Hero
        title="Checkout"
        subtitle="Revise seus dados e finalize sua solicitação."
      />

      <main className="checkout-page">
        <section className="checkout-card checkout-summary">
          <h2>Resumo do Pedido</h2>

          {cartItems.length === 0 ? (
            <p className="checkout-empty">
              Seu carrinho está vazio.
              {" "}
              <Link to="/produtos">
                Ver produtos
              </Link>
            </p>
          ) : (
            <div className="checkout-items">
              {cartItems.map((item) => (
                <article
                  className="checkout-item"
                  key={item.cart_item_id}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {item.quantity} unidade(s)
                    </p>

                    <p>
                      Locação por {item.days} dias
                    </p>

                    <strong>
                      {formatCurrency(
                        item.price_snapshot
                      )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(
                        item.cart_item_id
                      )
                    }
                  >
                    Remover
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              {formatCurrency(total)}
            </strong>
          </div>
        </section>

        <form
          className="checkout-card checkout-form"
          onSubmit={handleSubmit}
        >
          <h2>Dados do Cliente</h2>

          <label>
            Nome Completo *
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) =>
                updateForm(
                  "customer_name",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            CPF *
            <input
              type="text"
              placeholder="000.000.000-00"
              value={form.customer_cpf}
              onChange={(e) =>
                updateForm(
                  "customer_cpf",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Data de Nascimento *
            <input
              type="date"
              value={form.customer_birthdate}
              onChange={(e) =>
                updateForm(
                  "customer_birthdate",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Sexo *
            <select
              value={form.customer_gender}
              onChange={(e) =>
                updateForm(
                  "customer_gender",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Selecione
              </option>
              <option value="female">
                Feminino
              </option>
              <option value="male">
                Masculino
              </option>
              <option value="other">
                Outro
              </option>
            </select>
          </label>

          <label>
            Telefone *
            <input
              type="tel"
              value={form.customer_phone}
              onChange={(e) =>
                updateForm(
                  "customer_phone",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            E-mail *
            <input
              type="email"
              value={form.customer_email}
              onChange={(e) =>
                updateForm(
                  "customer_email",
                  e.target.value
                )
              }
              required
            />
          </label>

          <h2>Dados da Criança (Opcional)</h2>

          <label>
            Nome da Criança
            <input
              type="text"
              value={form.baby_name}
              onChange={(e) =>
                updateForm(
                  "baby_name",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Data de Nascimento / Aniversário
            <input
              type="date"
              value={form.baby_birthdate}
              onChange={(e) =>
                updateForm(
                  "baby_birthdate",
                  e.target.value
                )
              }
            />
          </label>

          <h2>Endereço</h2>

          <label>
            CEP *
            <input
              value={form.zip_code}
              onChange={(e) =>
                updateForm(
                  "zip_code",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Rua *
            <input
              value={form.street}
              onChange={(e) =>
                updateForm(
                  "street",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Número *
            <input
              value={form.number}
              onChange={(e) =>
                updateForm(
                  "number",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Complemento
            <input
              value={form.complement}
              onChange={(e) =>
                updateForm(
                  "complement",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Bairro *
            <input
              value={form.neighborhood}
              onChange={(e) =>
                updateForm(
                  "neighborhood",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Cidade *
            <input
              value={form.city}
              onChange={(e) =>
                updateForm(
                  "city",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Estado *
            <input
              value={form.state}
              onChange={(e) =>
                updateForm(
                  "state",
                  e.target.value
                )
              }
              required
            />
          </label>

          <h2>Entrega e Pagamento</h2>

          <label>
            Forma de Recebimento
            <select
              value={form.delivery_type}
              onChange={(e) =>
                updateForm(
                  "delivery_type",
                  e.target.value
                )
              }
            >
              <option value="pickup">
                Retirada na Loja
              </option>

              <option value="delivery">
                Entrega
              </option>
            </select>
          </label>

          <label>
            Forma de Pagamento
            <select
              value={form.payment_type}
              onChange={(e) =>
                updateForm(
                  "payment_type",
                  e.target.value
                )
              }
            >
              <option value="pix">
                PIX
              </option>

              <option value="card">
                Cartão
              </option>

              <option value="cash">
                Dinheiro
              </option>
            </select>
          </label>

          <label>
            Observações
            <textarea
              value={form.notes}
              onChange={(e) =>
                updateForm(
                  "notes",
                  e.target.value
                )
              }
              placeholder="Informações adicionais"
            />
          </label>

          <div className="checkout-terms-box">
            <Link
              to="/termos-locacao"
              target="_blank"
              className="checkout-terms-link"
            >
              Visualizar Termo de Locação
            </Link>

            <label className="checkout-terms">
              <input
                type="checkbox"
                checked={form.accept_terms}
                onChange={(e) =>
                  updateForm(
                    "accept_terms",
                    e.target.checked
                  )
                }
              />

              Li e aceito os termos de locação.
            </label>
          </div>

          {inlineError && (
            <p className="checkout-inline-error">
              {inlineError}
            </p>
          )}

          {error && !inlineError && (
            <ErrorMessage
              message={error.message}
            />
          )}

          <button
            className="checkout-submit"
            type="submit"
            disabled={
              loading ||
              cartItems.length === 0
            }
          >
            {loading
              ? "Finalizando..."
              : "Finalizar Solicitação"}
          </button>
        </form>
      </main>
    </>
  );
}