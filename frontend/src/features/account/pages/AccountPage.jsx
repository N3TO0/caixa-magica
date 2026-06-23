import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { useMyOrders } from "../hooks/useMyOrders";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const { user } = useAuth();
  const { error, loading, orders } = useMyOrders();

  return (
    <>
      <Hero
        title="Minha Conta"
        subtitle="Acompanhe seus dados cadastrais e seus pedidos."
      />

      <main className="account-page">
        <section className="account-card">
          <div className="account-photo">
            <img
              src={
                user?.avatar ||
                "https://via.placeholder.com/180x180?text=Cliente"
              }
              alt={user?.customer_name || "Cliente"}
            />
          </div>

          <div className="account-info">
            <h2>
              {user?.customer_name ||
                "Cliente Caixa Mágica"}
            </h2>

            <div className="account-grid">
              <div>
                <span>Nome Completo</span>
                <p>
                  {user?.customer_name ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>CPF</span>
                <p>
                  {user?.customer_cpf ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Data de Nascimento</span>
                <p>
                  {user?.customer_birthdate ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Sexo</span>
                <p>
                  {user?.customer_gender ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Telefone</span>
                <p>
                  {user?.customer_phone ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>E-mail</span>
                <p>
                  {user?.customer_email ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Nome da Criança</span>
                <p>
                  {user?.baby_name ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Data de Nascimento da Criança</span>
                <p>
                  {user?.baby_birthdate ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>CEP</span>
                <p>
                  {user?.zip_code ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Bairro</span>
                <p>
                  {user?.neighborhood ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Cidade</span>
                <p>
                  {user?.city ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Estado</span>
                <p>
                  {user?.state ||
                    "Não informado"}
                </p>
              </div>

              <div className="full-width">
                <span>Rua</span>
                <p>
                  {user?.street ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <span>Número</span>
                <p>
                  {user?.number ||
                    "Não informado"}
                </p>
              </div>

              <div className="full-width">
                <span>Complemento</span>
                <p>
                  {user?.complement ||
                    "Não informado"}
                </p>
              </div>
            </div>

            <Link
              to="/minha-conta/editar"
              className="primary-button"
            >
              Editar Cadastro
            </Link>
          </div>
        </section>

        <section className="orders-section">
          <h2>Meus Pedidos</h2>

          <div className="orders-grid">
            {loading && <p>Carregando pedidos...</p>}
            {error && <p>{error.message}</p>}
            {!loading && !error && orders.length === 0 && <p>Nenhum pedido encontrado.</p>}

            {!loading && !error && orders.map((order) => (
              <article
                key={order.id}
                className="order-card"
              >
                <div className="order-header">
                  <span className="order-number">
                    Pedido #{order.id}
                  </span>

                  <span className="order-status">
                    {order.status}
                  </span>
                </div>

                <h3>{order.status}</h3>

                <p>
                  <strong>Itens:</strong>{" "}
                  {order.items_count}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  {formatCurrency(order.total_amount)}
                </p>

                <Link
                  to={`/pedidos/${order.id}`}
                  className="primary-button"
                >
                  Ver Pedido
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
