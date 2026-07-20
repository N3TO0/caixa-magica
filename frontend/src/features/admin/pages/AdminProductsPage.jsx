import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { getCategories } from "@/features/products/api/productsApi";
import AdminSummaryCards from "../components/AdminSummaryCards";
import AdminSectionTabs from "../components/AdminSectionTabs";
import { getAdminProducts, getAdminProductsSummary, updateAdminProductStatus } from "../api/adminApi";
import "../styles/AdminProductsPage.css";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/96x96?text=Produto";

const PRODUCT_TYPE_LABELS = {
  rental: "Aluguel",
  sale: "Venda",
  kit: "Kit",
  gift: "Vale presente",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        setStatusMessage("");

        const [productsResponse, categoriesResponse, summaryResponse] = await Promise.all([
          getAdminProducts(),
          getCategories(),
          getAdminProductsSummary(),
        ]);

        const categoryMap = new Map(
          (Array.isArray(categoriesResponse) ? categoriesResponse : []).map((category) => [
            category.id,
            category,
          ])
        );

        const detailedProducts = (Array.isArray(productsResponse) ? productsResponse : []).map((product) => ({
          ...product,
          categories:
            product.categories?.map((category) => categoryMap.get(category.id) || category) ||
            [],
        }));

        if (active) {
          setProducts(detailedProducts);
          setSummary(summaryResponse || null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Nao foi possivel carregar os produtos.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryName = product.categories?.[0]?.name || "";
      const matchesSearch = !normalizedSearch || [product.name, product.slug, categoryName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus = statusFilter === "all"
        || (statusFilter === "active" && product.is_active)
        || (statusFilter === "inactive" && !product.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  async function handleToggleStatus(product) {
    try {
      setError("");
      setStatusMessage("");

      await updateAdminProductStatus(product.id, { ativo: !product.is_active });

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, is_active: !item.is_active } : item
        )
      );

      setStatusMessage(
        `${product.name} foi ${product.is_active ? "desativado" : "ativado"} com sucesso.`
      );
    } catch (err) {
      setError(err.message || "Nao foi possivel atualizar o status do produto.");
    }
  }

  function getProductTypeLabel(product) {
    return product.categories?.[0]?.name || PRODUCT_TYPE_LABELS[product.type] || product.type || "-";
  }

  return (
    <div className="admin-products-page">
      <div className="admin-container">
        <AdminSectionTabs />
        <Hero title="Produtos" subtitle="Gerencie o catalogo de produtos, categorias e disponibilidade administrativa." />

        {summary ? (
          <AdminSummaryCards
            items={[
              { label: "Total", value: summary.total },
              { label: "Ativos", value: summary.active },
              { label: "Inativos", value: summary.inactive },
              { label: "Venda", value: summary.sale },
              { label: "Aluguel", value: summary.rental },
            ]}
          />
        ) : null}

        <div className="admin-products-toolbar">
          <Link to="/admin/produtos/novo" className="admin-primary-button admin-products-toolbar__create">
            Novo produto
          </Link>

          <div className="admin-products-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produto"
              aria-label="Buscar produto"
            />
          </div>

          <select
            className="admin-products-toolbar__filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {statusMessage && <div className="admin-feedback success">{statusMessage}</div>}
        {error && <div className="admin-feedback error">{error}</div>}

        <section className="admin-products-list">
          <div className="admin-products-list__header">
            <span>Produto</span>
            <span>Categoria</span>
            <span>Estoque</span>
            <span>Status</span>
            <span>Acoes</span>
          </div>

          {loading ? (
            <div className="admin-products-list__empty">Carregando produtos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-products-list__empty">Nenhum produto encontrado.</div>
          ) : (
            filteredProducts.map((product) => (
              <article className="admin-products-row" key={product.id}>
                <div className="admin-products-row__product">
                  <img src={product.images?.[0]?.url || PLACEHOLDER_IMAGE} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.slug}</span>
                  </div>
                </div>

                <span>{getProductTypeLabel(product)}</span>
                <span>{product.total_units}</span>
                <span>
                  <button
                    type="button"
                    className={`admin-status-badge${product.is_active ? " active" : " inactive"}`}
                    onClick={() => handleToggleStatus(product)}
                  >
                    {product.is_active ? "Ativo" : "Inativo"}
                  </button>
                </span>

                <span className="admin-products-row__actions">
                  <Link to={`/admin/produtos/${product.id}/editar`} className="admin-icon-button">
                    Editar
                  </Link>
                </span>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
