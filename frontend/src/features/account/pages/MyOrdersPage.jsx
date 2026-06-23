import { Link } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { useMyOrders } from "../hooks/useMyOrders";
import "../styles/AccountPage.css";

export default function MyOrdersPage() {
  const { error, loading, orders } = useMyOrders();

  return (
    <>
      <Hero title="Meus pedidos" subtitle="Veja o histórico e o status das suas solicitações." />
      <main className="account-page">
        {loading && <LoadingState message="Carregando pedidos..." />}
        {error && <ErrorMessage message={error.message} />}
        {!loading && !error && orders.length === 0 && <EmptyState title="Nenhum pedido encontrado" />}

        <section className="orders-list">
          {orders.map(order => (
            <article className="account-card order-card" key={order.id}>
              <span>Pedido #{order.id}</span>
              <h2>{order.status}</h2>
              <p>Total: {formatCurrency(order.total_amount)}</p>
              <Link to={`/pedidos/${order.id}`}>Ver detalhes</Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
