import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <>
      <Hero title="Minha conta" subtitle="Acompanhe seus dados e pedidos da Caixa Mágica." />
      <main className="account-page">
        <section className="account-card">
          <h2>{user?.name || "Cliente Caixa Mágica"}</h2>
          <p>{user?.email || "admin@email.com"}</p>
          <Link className="primary-button" to="/meus-pedidos">Ver meus pedidos</Link>
        </section>
      </main>
    </>
  );
}
