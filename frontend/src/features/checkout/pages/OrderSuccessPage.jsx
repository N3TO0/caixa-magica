import { Link, useLocation, useParams } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import "../styles/OrderSuccessPage.css";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { state } = useLocation();

  return (
    <>
      <Hero title="Pedido recebido" subtitle="Sua solicitação foi registrada e nossa equipe fará contato para confirmação." />

      <main className="order-success-page">
        <section className="order-success-card">
          <span>Pedido #{id}</span>
          <h2>Status: {state?.status || "pendente"}</h2>
          <p>Total estimado: <strong>{formatCurrency(state?.total || 0)}</strong></p>
          <Link className="primary-button" to="/produtos">Continuar alugando</Link>
        </section>
      </main>
    </>
  );
}
