import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const { user } = useAuth();

  // Futuramente virá da API
  const orders = [
    {
      id: "PED-001",
      productName: "Berço Portátil",
      status: "Em andamento",
      startDate: "10/06/2026",
      endDate: "17/06/2026",
      itemsCount: 1,
      total: 149.9,
    },
    {
      id: "PED-002",
      productName: "Cadeira de Alimentação",
      status: "Finalizado",
      startDate: "01/05/2026",
      endDate: "15/05/2026",
      itemsCount: 2,
      total: 239.9,
    },
  ];

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
            {orders.map((order) => (
              <article
                key={order.id}
                className="order-card"
              >
                <div className="order-header">
                  <span className="order-number">
                    {order.id}
                  </span>

                  <span className="order-status">
                    {order.status}
                  </span>
                </div>

                <h3>{order.productName}</h3>

                <p>
                  <strong>Itens:</strong>{" "}
                  {order.itemsCount}
                </p>

                <p>
                  <strong>Início:</strong>{" "}
                  {order.startDate}
                </p>

                <p>
                  <strong>Devolução:</strong>{" "}
                  {order.endDate}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  R${" "}
                  {order.total
                    .toFixed(2)
                    .replace(".", ",")}
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
