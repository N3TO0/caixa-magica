import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { getAdminOrders } from "../api/adminApi";
import "../styles/AdminPedidosPage.css";

export default function AdminOrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  async function carregarPedidos() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminOrders({ page, limit, status });
      setPedidos(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message || "Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, [page, status]);

  return (
    <div className="pedidos-page">
      <div className="admin-container">
        <Hero
          title="Pedidos"
          subtitle="Gerencie todos os pedidos cadastrados"
        />

        <div className="toolbar">
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
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

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
              ) : error ? (
                <tr>
                  <td colSpan="6" className="loading">
                    {error}
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.client_name}</td>
                    <td>{p.id}</td>
                    <td>{p.status}</td>
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
