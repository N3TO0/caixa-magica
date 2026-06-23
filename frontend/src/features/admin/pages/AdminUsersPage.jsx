import { useEffect, useState } from "react";
import Hero from "@/shared/components/Hero";
import { getAdminUsers } from "../api/adminApi";
import "../styles/AdminUsuariosPage.css";

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminUsers();
      setUsuarios(response.data || []);
    } catch (err) {
      setError(err.message || "Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="admin-usuarios-page">

      <Hero
        title="Clientes"
        subtitle="Gerenciamento de clientes cadastrados"
      />

      <div className="admin-container">

        <div className="toolbar">

          <div className="search-box">
            <span className="icon">🔍</span>

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar cliente..."
            />
          </div>

        </div>

        {loading ? (
          <div className="loading">
            Carregando clientes...
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
                  <p><strong>Pedidos:</strong> {usuario.total_orders}</p>
                  <p>
                    <strong>Cadastro:</strong>{" "}
                    {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="usuario-actions">
                  <button className="btn-action" type="button" disabled>
                    Detalhe indisponível
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
