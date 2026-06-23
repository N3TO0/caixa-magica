import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getOrderDetail } from "../api/accountApi";
import "../styles/AccountPage.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        setLoading(true);
        const response = await getOrderDetail(id);
        if (active) setOrder(response.data || null);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <Hero title={`Pedido #${id}`} subtitle="Detalhes do seu pedido." />
      <main className="account-page">
        {loading && <LoadingState message="Carregando pedido..." />}
        {error && <ErrorMessage message={error.message} />}
        {!loading && !error && !order && <EmptyState title="Pedido não encontrado" />}

        {order && (
          <section className="account-card order-detail-card">
            <h2>Status: {order.status}</h2>
            <p>Total: {formatCurrency(order.total_amount)}</p>
            <div className="order-detail-items">
              {(order.items || []).map(item => (
                <article key={`${order.id}-${item.id}`}>
                  <strong>{item.product_name}</strong>
                  <span>{item.days} dias • {item.start_date} até {item.end_date}</span>
                </article>
              ))}
            </div>
            <Link className="primary-button" to="/meus-pedidos">Voltar aos pedidos</Link>
          </section>
        )}
      </main>
    </>
  );
}
