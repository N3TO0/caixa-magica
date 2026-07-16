import { Link, useNavigate } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getStatusLabel, getStatusTone } from "@/shared/utils/orderLabelUtils";
import { notifyInfo } from "@/shared/utils/toastUtils";
import { useMyOrders } from "../hooks/useMyOrders";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { error, loading, orders } = useMyOrders();

  function handleLogout() {
    logout();
    notifyInfo("Você saiu da sua conta.");
    navigate("/login", { replace: true });
  }

  const personalInfo = [
    ["Nome completo", user?.customer_name],
    ["CPF", user?.customer_cpf],
    ["Data de nascimento", user?.customer_birthdate],
    ["Telefone", user?.customer_phone],
    ["E-mail", user?.customer_email],
  ];

  const addressInfo = [
    ["CEP", user?.zip_code],
    ["Bairro", user?.neighborhood],
    ["Cidade", user?.city],
    ["Estado", user?.state],
    ["Rua", user?.street, true],
    ["Numero", user?.number],
    ["Complemento", user?.complement, true],
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
                user?.profile_photo ||
                "https://via.placeholder.com/180x180?text=Cliente"
              }
              alt={user?.customer_name || "Cliente"}
            />
          </div>

          <div className="account-info">
            <div className="account-info__header">
              <div>
                <p className="account-section__eyebrow">Minha conta</p>
                <h2>{user?.customer_name || "Cliente Caixa Magica"}</h2>
              </div>

              <Link to="/meus-pedidos" className="primary-button account-orders-button">
                Meus pedidos
              </Link>
            </div>

            <section className="account-block">
              <h3>Dados pessoais</h3>
              <div className="account-grid">
                {personalInfo.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <p>{value || "Nao informado"}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="account-block">
              <h3>Endereco principal</h3>
              <div className="account-grid">
                {addressInfo.map(([label, value, fullWidth]) => (
                  <div key={label} className={fullWidth ? "full-width" : ""}>
                    <span>{label}</span>
                    <p>{value || "Nao informado"}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="account-actions">
              <Link to="/minha-conta/editar" className="primary-button">
                Editar Cadastro
              </Link>

              <Link to="/favoritos" className="secondary-button">
                Favoritos
              </Link>

              <button
                type="button"
                className="secondary-button"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
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

                  <span className={`order-status order-status--${getStatusTone(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <h3>{getStatusLabel(order.status)}</h3>

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
