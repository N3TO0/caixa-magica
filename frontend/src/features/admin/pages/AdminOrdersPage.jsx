import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import AdminSummaryCards from "../components/AdminSummaryCards";
import AdminSectionTabs from "../components/AdminSectionTabs";
import { expirePendingOrders, getAdminOrders, getAdminOrdersSummary } from "../api/adminApi";
import { getStatusLabel, getStatusTone } from "@/shared/utils/orderLabelUtils";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import "../styles/AdminPedidosPage.css";

export default function AdminOrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expiring, setExpiring] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState(null);

  const limit = 10;

  const pedidosFiltrados = pedidos.filter((pedido) =>
    [pedido.client_name, pedido.id, pedido.status]
      .join(" ")
      .toLowerCase()
      .includes(busca.trim().toLowerCase())
  );

  async function carregarPedidos() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const [data, summaryData] = await Promise.all([
        getAdminOrders({ page, limit, status }),
        getAdminOrdersSummary(),
      ]);
      setPedidos(data.data || []);
      setTotalPages(data.total_pages || 1);
      setSummary(summaryData.data || null);
    } catch (err) {
      const message = err.message || "Não foi possível carregar os pedidos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, [page, status]);

  async function handleExpirePendingOrders() {
    try {
      setExpiring(true);
      setError("");
      const response = await expirePendingOrders();
      setSuccess(response.message || "Pedidos pendentes expirados com sucesso.");
      notifySuccess(response.message || "Pedidos pendentes expirados com sucesso.");
      await carregarPedidos();
    } catch (err) {
      const message = err.message || "Não foi possível expirar os pedidos pendentes.";
      setError(message);
      notifyError(message);
    } finally {
      setExpiring(false);
    }
  }

  return (
    <div className="pedidos-page">
      <div className="admin-container">
        <AdminSectionTabs />
        <Hero
          title="Pedidos"
          subtitle="Acompanhe, filtre e atualize os pedidos recebidos pela operacao."
        />

        {summary ? (
          <AdminSummaryCards
            items={[
              { label: "Total", value: summary.total },
              { label: "Pendentes", value: summary.pending },
              { label: "Confirmados", value: summary.confirmed },
              { label: "Finalizados", value: summary.finalized },
            ]}
          />
        ) : null}

        <div className="toolbar">
          <button
            type="button"
            className="admin-primary-button toolbar-action"
            onClick={handleExpirePendingOrders}
            disabled={loading || expiring}
          >
            {expiring ? "Expirando..." : "Expirar pendentes"}
          </button>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pedido"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="em_uso">Em uso</option>
            <option value="devolvido">Devolvido</option>
            <option value="cancelado">Cancelado</option>
            <option value="atrasado">Atrasado</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        {success && <div className="admin-feedback success">{success}</div>}
        {error && <div className="admin-feedback error">{error}</div>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading">
                    Carregando...
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="loading">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.client_name}</td>
                    <td>{p.id}</td>
                    <td>
                      <span className={`admin-order-status admin-order-status--${getStatusTone(p.status)}`}>
                        {getStatusLabel(p.status)}
                      </span>
                    </td>
                    <td>
                      {Number(p.total_amount || 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>
                      {new Date(p.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="acoes-coluna">
                      <Link
                        to={`/admin/pedidos/${p.id}/status`}
                        className="btn-action"
                      >
                        Atualizar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
