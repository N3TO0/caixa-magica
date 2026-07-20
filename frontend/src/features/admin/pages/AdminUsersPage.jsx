import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import AdminSummaryCards from "../components/AdminSummaryCards";
import AdminSectionTabs from "../components/AdminSectionTabs";
import { getAdminUsers, getAdminUsersSummary } from "../api/adminApi";
import "../styles/AdminUsuariosPage.css";

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

    async function carregarUsuarios() {
      try {
        setLoading(true);
        setError("");
        const [response, summaryResponse] = await Promise.all([
          getAdminUsers(),
          getAdminUsersSummary(),
        ]);
        setUsuarios(response.data || []);
        setSummary(summaryResponse || null);
      } catch (err) {
        setError(err.message || "Nao foi possivel carregar os usuarios.");
      } finally {
        setLoading(false);
      }
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(busca.toLowerCase())
    && (
      statusFilter === "all"
      || (statusFilter === "active" && usuario.is_active)
      || (statusFilter === "inactive" && !usuario.is_active)
    )
  );

  return (
    <div className="admin-usuarios-page">
      <div className="admin-container">
        <AdminSectionTabs />

        <Hero
          title="Usuarios"
          subtitle="Gerencie clientes e administradores cadastrados no sistema"
        />

        {summary ? (
          <AdminSummaryCards
            items={[
              { label: "Total", value: summary.total },
              { label: "Ativos", value: summary.total - summary.inactive },
              { label: "Admins", value: summary.admins },
              { label: "Inativos", value: summary.inactive },
            ]}
          />
        ) : null}

        <div className="toolbar">
          <Link className="btn-action btn-action--primary" to="/admin/usuarios/novo">
            Novo usuario
          </Link>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar usuario..."
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            Carregando usuarios...
          </div>
        ) : error ? (
          <div className="loading">
            {error}
          </div>
        ) : (
          <div className="usuarios-grid">

            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="usuario-card">

                <div className="usuario-info">
                  <h3>{usuario.name}</h3>

                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>Telefone:</strong> {usuario.phone || "-"}</p>
                  <p><strong>Perfil:</strong> {usuario.role === "admin" ? "Administrador" : "Cliente"}</p>
                  <p><strong>Status:</strong> {usuario.is_active ? "Ativo" : "Inativo"}</p>
                  <p><strong>Pedidos:</strong> {usuario.total_orders}</p>
                  <p>
                    <strong>Cadastro:</strong>{" "}
                    {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="usuario-actions">
                  <Link className="btn-action" to={`/admin/usuarios/${usuario.id}`}>
                    Ver detalhes
                  </Link>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
