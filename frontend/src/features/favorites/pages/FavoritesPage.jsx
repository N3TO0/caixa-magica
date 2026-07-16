import { Link } from "react-router-dom";
import EmptyState from "@/shared/components/EmptyState";
import Hero from "@/shared/components/Hero";
import ProductCard from "@/features/products/components/ProductCard";
import { useFavorites } from "../hooks/useFavorites";
import "@/features/products/styles/ProductsPage.css";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <>
      <Hero
        title="Favoritos"
        subtitle="Guarde aqui os produtos que voce quer revisar ou alugar depois."
      />

      <main className="produtos-page">
        <section className="produtos-toolbar-card">
          <div className="produtos-toolbar-card__intro">
            <p className="produtos-toolbar-card__eyebrow">Sua selecao</p>
            <h2>Produtos salvos por voce</h2>
            <span>Use esta lista para retomar comparacoes e acessar rapidamente os itens que mais chamaram sua atencao.</span>
          </div>

          <div className="produtos-toolbar-card__footer">
            <span>{favorites.length} {favorites.length === 1 ? "produto salvo" : "produtos salvos"}</span>
            <Link to="/produtos" className="produtos-toolbar-card__reset">Explorar catalogo</Link>
          </div>
        </section>

        {favorites.length === 0 ? (
          <div className="account-empty-state">
            <EmptyState title="Voce ainda nao salvou favoritos" message="Quando um produto chamar sua atencao, use o botao de favoritar no detalhe para encontra-lo aqui depois." />
            <Link to="/produtos" className="primary-button">Explorar produtos</Link>
          </div>
        ) : (
          <div className="grid">
            {favorites.map((produto) => (
              <div key={produto.id} className="favorite-card-shell">
                <ProductCard produto={produto} />
                <button
                  type="button"
                  className="favorite-card-shell__remove"
                  onClick={() => toggleFavorite(produto)}
                >
                  Remover dos favoritos
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
