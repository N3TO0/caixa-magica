import { Link, useLocation, useParams } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { getStatusLabel } from "@/shared/utils/orderLabelUtils";
import "../styles/OrderSuccessPage.css";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const isSale = state?.mode === "sale";

  return (
    <>
      <Hero title="Pedido recebido" subtitle={isSale ? "Sua solicitacao de compra foi registrada e nossa equipe fara contato para confirmacao." : "Sua solicitação foi registrada e nossa equipe fará contato para confirmação."} />

      <main className="order-success-page">
        <section className="order-success-card">
          <span>Pedido #{id}</span>
          <h2>Status: {getStatusLabel(state?.status || "pendente")}</h2>
          <p>Total estimado: <strong>{formatCurrency(state?.total || 0)}</strong></p>
          <Link className="primary-button" to="/produtos">{isSale ? "Continuar comprando" : "Continuar alugando"}</Link>
        </section>
      </main>
    </>
  );
}
