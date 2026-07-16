import { Link } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getStatusLabel, getStatusTone } from "@/shared/utils/orderLabelUtils";
import { useMyOrders } from "../hooks/useMyOrders";
import "../styles/AccountPage.css";

export default function MyOrdersPage() {
  const { error, loading, orders } = useMyOrders();
  const totalOrders = orders.length;

  return (
    <>
      <Hero title="Meus pedidos" subtitle="Veja o histórico e o status das suas solicitações." />
      <main className="account-page">
        {loading && <LoadingState message="Carregando pedidos..." />}
        {error && <ErrorMessage message={error.message} />}
        {!loading && !error && orders.length === 0 && (
          <div className="account-empty-state">
            <EmptyState title="Voce ainda nao fez nenhum pedido" message="Explore o catalogo para encontrar brinquedos e itens ideais para o seu momento." />
            <Link to="/produtos" className="primary-button">Explorar produtos</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <section className="orders-list-page">
            <div className="orders-list-page__summary account-card">
              <div>
                <p className="orders-list-page__eyebrow">Historico</p>
                <h2>Seus pedidos em um so lugar</h2>
                <span className="orders-list-page__caption">
                  Acompanhe o andamento das locacoes e revise os detalhes de cada solicitacao.
                </span>
              </div>

              <div className="orders-list-page__count-card">
                <strong>{totalOrders}</strong>
                <span>{totalOrders === 1 ? "pedido registrado" : "pedidos registrados"}</span>
              </div>
            </div>

            <section className="orders-list-page__grid">
              {orders.map((order) => (
                <article className="order-card order-card--detailed" key={order.id}>
                  <div className="order-header order-header--detailed">
                    <div>
                      <span className="order-number">Pedido #{order.id}</span>
                      <h2 className="order-card__title">{getStatusLabel(order.status)}</h2>
                    </div>

                    <span className={`order-status order-status--${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </div>

                  <div className="order-card__meta-grid">
                    <div>
                      <span>Data do pedido</span>
                      <strong>{new Date(order.created_at).toLocaleDateString("pt-BR")}</strong>
                    </div>

                    <div>
                      <span>Itens</span>
                      <strong>{order.items_count}</strong>
                    </div>

                    <div className="order-card__meta-grid-full">
                      <span>Total</span>
                      <strong className="order-card__total">{formatCurrency(order.total_amount)}</strong>
                    </div>
                  </div>

                  <Link to={`/pedidos/${order.id}`} className="primary-button order-card__link">
                    Ver detalhes do pedido
                  </Link>
                </article>
              ))}
            </section>
          </section>
        )}
      </main>
    </>
  );
}
