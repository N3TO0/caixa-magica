import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import "./styles/AdminUsuariosPage.css";

export default function AdminUsuariosPage() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    setLoading(true);

    const responseMock = {
      success: true,
      data: {
        usuarios: [
          {
            id: 1,
            name: "Felipe Teste",
            email: "felipe@teste.com",
            phone: "(79) 99999-1111",
            total_pedidos: 3,
            created_at: "2026-05-20T18:04:02Z",
          },
          {
            id: 2,
            name: "Maria Silva",
            email: "maria@email.com",
            phone: "(79) 99999-2222",
            total_pedidos: 7,
            created_at: "2026-05-10T14:00:00Z",
          },
          {
            id: 3,
            name: "João Santos",
            email: "joao@email.com",
            phone: null,
            total_pedidos: 1,
            created_at: "2026-04-18T09:20:00Z",
          },
        ],
      },
    };

    setUsuarios(responseMock.data.usuarios);
    setLoading(false);
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

        {/* TOOLBAR PADRÃO HERO/PEDIDOS */}
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

        {/* LISTA */}
        {loading ? (
          <div className="loading">
            Carregando clientes...
          </div>
        ) : (
          <div className="usuarios-grid">

            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="usuario-card">

                <div className="usuario-info">
                  <h3>{usuario.name}</h3>

                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>Telefone:</strong> {usuario.phone || "-"}</p>
                  <p><strong>Pedidos:</strong> {usuario.total_pedidos}</p>
                  <p>
                    <strong>Cadastro:</strong>{" "}
                    {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="usuario-actions">
                  <button
                    className="btn-action"
                    onClick={() => navigate(`/admin/clientes/${usuario.id}`)}
                  >
                    Ver Mais
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