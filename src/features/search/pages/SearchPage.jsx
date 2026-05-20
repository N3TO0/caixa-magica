import { useParams } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import ProductCard from "@/features/products/components/ProductCard";
import { useSearchProducts } from "../hooks/useSearchProducts";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const { termo } = useParams();
  const { error, loading, results } = useSearchProducts(termo);

  return (
    <>
      <Hero title="Resultados da pesquisa" subtitle="Veja o termo pesquisado e continue explorando nossos produtos." />
      <main className="pesquisa-page">
        <p>Você pesquisou por: <strong>{termo}</strong></p>
        {loading && <LoadingState message="Buscando produtos..." />}
        {error && <ErrorMessage message={error.message} />}
        {!loading && !error && results.length === 0 && <EmptyState title="Nenhum produto encontrado" />}
        <div className="pesquisa-grid">
          {results.map(product => <ProductCard key={product.id} produto={product} />)}
        </div>
      </main>
    </>
  );
}
