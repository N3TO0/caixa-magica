import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import "./styles/AdminPedidosPage.css";

function mockApiPedidos({ page, limit, status }) {
  const all = [
    { id: 3, cliente: "Felipe Teste", status: "pendente", total_amount: 40.0, created_at: "2026-06-01T10:00:00Z" },
    { id: 4, cliente: "Maria Silva", status: "confirmado", total_amount: 120.0, created_at: "2026-06-02T10:00:00Z" },
    { id: 5, cliente: "João Souza", status: "em_uso", total_amount: 85.5, created_at: "2026-06-03T10:00:00Z" },
    { id: 6, cliente: "Ana Costa", status: "finalizado", total_amount: 200.0, created_at: "2026-06-04T10:00:00Z" },
  ];

  let filtered = status ? all.filter(p => p.status === status) : all;

  const total = filtered.length;
  const total_paginas = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const pedidos = filtered.slice(start, start + limit);

  return {
    success: true,
    data: {
      pedidos,
      total,
      pagina: page,
      total_paginas,
    },
  };
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const limit = 10;

  async function carregarPedidos() {
    setLoading(true);

    const data = mockApiPedidos({
      page,
      limit,
      status,
    });

    setPedidos(data.data.pedidos);
    setLoading(false);
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
  ) : (
    pedidos.map((p) => (
      <tr key={p.id}>
        <td>{p.cliente}</td>
        <td>{p.id}</td>
        <td>{p.status}</td>
        <td>
          {p.total_amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </td>
        <td>
          {new Date(p.created_at).toLocaleDateString("pt-BR")}
        </td>
        <td className="acoes-coluna">
          <Link
            to={`/admin/pedidos/${p.id}`}
            className="btn-action"
          >
            Ver
          </Link>
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from(
            { length: mockApiPedidos({ page, limit, status }).data.total_paginas },
            (_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
}
