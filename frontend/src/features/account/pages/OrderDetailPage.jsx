import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getDeliveryTypeLabel, getPaymentTypeLabel, getStatusLabel, getStatusTone } from "@/shared/utils/orderLabelUtils";
import { getOrderDetail } from "../api/accountApi";
import "../styles/AccountPage.css";

function getNextStepMessage(order) {
  if (!order) return "";

  const hasSaleItem = (order.items || []).some((item) => item.item_type === "sale");

  if (hasSaleItem) {
    return "Nossa equipe vai confirmar a compra e alinhar retirada ou entrega dos produtos selecionados.";
  }

  if (order.status === "pendente") {
    return "Nossa equipe vai confirmar os detalhes do pedido e orientar os proximos passos da locacao.";
  }

  if (order.status === "confirmado") {
    return "Seu pedido esta confirmado. Agora e so aguardar as orientacoes de retirada ou entrega.";
  }

  if (order.status === "em_uso") {
    return "O aluguel esta em andamento. Fique atento a data combinada para devolucao.";
  }

  if (order.status === "atrasado") {
    return "A devolucao esta em atraso. Entre em contato com a equipe para regularizar a locacao.";
  }

  return "Acompanhe abaixo o historico completo deste pedido.";
}

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
            <div className="order-detail-summary">
              <div>
                <div className="order-detail-status-row">
                  <h2>Status: {getStatusLabel(order.status)}</h2>
                  <span className={`order-status order-status--${getStatusTone(order.status)}`}>{getStatusLabel(order.status)}</span>
                </div>
                <p>
                  Entrega: <strong>{getDeliveryTypeLabel(order.delivery_type)}</strong>
                </p>
                <p>
                  Pagamento: <strong>{getPaymentTypeLabel(order.payment_type)}</strong>
                </p>
              </div>

              <strong className="order-detail-total">
                {formatCurrency(order.total_amount)}
              </strong>
            </div>

            <div className="order-detail-next-step">
              <strong>Proximo passo</strong>
              <span>{getNextStepMessage(order)}</span>
            </div>

            <div className="order-detail-items">
              {(order.items || []).map(item => (
                <article key={`${order.id}-${item.id}`}>
                  <strong>{item.product_name}</strong>
                  {item.item_type === "sale" ? (
                    <span>{item.quantity} unidade(s) • Compra</span>
                  ) : (
                    <span>{item.days} dias • {item.start_date} ate {item.end_date}</span>
                  )}
                  <small>
                    {item.item_type === "sale"
                      ? formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))
                      : formatCurrency(item.price)}
                  </small>
                </article>
              ))}
            </div>

            <div className="order-history-card">
              <h3>Historico</h3>
              <div className="order-history-list">
                {(order.status_history || []).map((history, index) => (
                  <div key={`${history.changed_at}-${index}`} className="order-history-item">
                    <strong>{getStatusLabel(history.status)}</strong>
                    <span>{new Date(history.changed_at).toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link className="primary-button" to="/meus-pedidos">Voltar aos pedidos</Link>
          </section>
        )}
      </main>
    </>
  );
}
