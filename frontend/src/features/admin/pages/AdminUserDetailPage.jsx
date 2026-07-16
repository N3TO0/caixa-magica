import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import AdminSectionTabs from "../components/AdminSectionTabs";
import { createAdminUser, deleteAdminUser, getAdminUserById, updateAdminUser } from "../api/adminApi";
import "../styles/AdminUsuariosPage.css";

function buildInitialState(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpf: user?.cpf || "",
    birthdate: user?.birthdate || "",
    role: user?.role || "customer",
    is_active: user?.is_active ?? true,
    zip_code: user?.zip_code || "",
    street: user?.street || "",
    number: user?.number || "",
    complement: user?.complement || "",
    neighborhood: user?.neighborhood || "",
    city: user?.city || "",
    state: user?.state || "",
    password: "",
  };
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(() => buildInitialState(null));
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!isEditing) {
        setForm(buildInitialState(null));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await getAdminUserById(id);
        if (!active) return;
        setUser(response);
        setForm(buildInitialState(response));
      } catch (err) {
        const message = err.message || "Nao foi possivel carregar os detalhes do usuario.";
        if (active) {
          setError(message);
        }
        notifyError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const title = useMemo(() => {
    if (!isEditing) return "Novo usuario";
    return user?.name || "Editar usuario";
  }, [isEditing, user]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Nome e email sao obrigatorios.");
      return;
    }

    if (!isEditing && !form.password.trim()) {
      setError("Informe uma senha para criar o usuario.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      cpf: form.cpf.trim() || null,
      birthdate: form.birthdate || null,
      role: form.role,
      is_active: form.is_active,
      zip_code: form.zip_code.trim() || null,
      street: form.street.trim() || null,
      number: form.number.trim() || null,
      complement: form.complement.trim() || null,
      neighborhood: form.neighborhood.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
    };

    try {
      setSaving(true);
      if (isEditing) {
        const response = await updateAdminUser(id, payload);
        setUser(response);
        setForm(buildInitialState(response));
        notifySuccess("Usuario atualizado com sucesso.");
      } else {
        const response = await createAdminUser(payload);
        notifySuccess("Usuario criado com sucesso.");
        navigate(`/admin/usuarios/${response.id}`);
      }
    } catch (err) {
      const message = err.message || "Nao foi possivel salvar o usuario.";
      setError(message);
      notifyError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing || !window.confirm("Deseja realmente excluir este usuario?")) {
      return;
    }

    try {
      setDeleting(true);
      await deleteAdminUser(id);
      notifySuccess("Usuario excluido com sucesso.");
      navigate("/admin/usuarios");
    } catch (err) {
      const message = err.message || "Nao foi possivel excluir o usuario.";
      setError(message);
      notifyError(message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleStatus() {
    if (!isEditing || !user) {
      return;
    }

    try {
      setChangingStatus(true);
      const response = await updateAdminUser(id, {
        is_active: !user.is_active,
      });
      setUser(response);
      setForm(buildInitialState(response));
      notifySuccess(`Usuario ${user.is_active ? "desativado" : "ativado"} com sucesso.`);
    } catch (err) {
      const message = err.message || "Nao foi possivel atualizar o status do usuario.";
      setError(message);
      notifyError(message);
    } finally {
      setChangingStatus(false);
    }
  }

  return (
    <div className="admin-usuarios-page">
      <div className="admin-container">
        <AdminSectionTabs />

        <Hero
          title={isEditing ? "Detalhes do usuario" : "Cadastro de usuario"}
          subtitle={isEditing ? "Edite, atualize ou exclua o usuario selecionado." : "Crie um novo usuario diretamente pela area administrativa."}
        />

        <div className="admin-form-shell__back">
          <Link to="/admin/usuarios">Voltar para usuarios</Link>
        </div>

        {loading ? (
          <div className="loading">Carregando usuario...</div>
        ) : (
          <div className="usuario-detail-layout">
            <form className="usuario-form-card" onSubmit={handleSubmit}>
              <div className="usuario-form-card__header">
                <div>
                  <p className="usuario-form-card__eyebrow">Administracao</p>
                  <h2>{title}</h2>
                </div>
                {isEditing && user ? <span className="usuario-form-card__meta">Cadastro: {formatDate(user.created_at)}</span> : null}
              </div>

              <div className="usuario-form-grid">
                <label>
                  Nome
                  <input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
                </label>

                <label>
                  Email
                  <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
                </label>

                <label>
                  Telefone
                  <input type="text" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
                </label>

                <label>
                  CPF
                  <input type="text" value={form.cpf} onChange={(event) => updateField("cpf", event.target.value)} />
                </label>

                <label>
                  Data de nascimento
                  <input type="date" value={form.birthdate} onChange={(event) => updateField("birthdate", event.target.value)} />
                </label>

                <label>
                  {isEditing ? "Nova senha" : "Senha"}
                  <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder={isEditing ? "Preencha apenas se quiser alterar" : "Minimo de 6 caracteres"} />
                </label>

                {isEditing ? (
                  <label>
                    Perfil
                    <select value={form.role} onChange={(event) => updateField("role", event.target.value)}>
                      <option value="customer">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </label>
                ) : (
                  <label className="usuario-form-card__checkbox">
                    <input type="checkbox" checked={form.role === "admin"} onChange={(event) => updateField("role", event.target.checked ? "admin" : "customer")} />
                    Criar como administrador
                  </label>
                )}


                <label>
                  CEP
                  <input type="text" value={form.zip_code} onChange={(event) => updateField("zip_code", event.target.value)} />
                </label>

                <label>
                  Rua
                  <input type="text" value={form.street} onChange={(event) => updateField("street", event.target.value)} />
                </label>

                <label>
                  Numero
                  <input type="text" value={form.number} onChange={(event) => updateField("number", event.target.value)} />
                </label>

                <label>
                  Complemento
                  <input type="text" value={form.complement} onChange={(event) => updateField("complement", event.target.value)} />
                </label>

                <label>
                  Bairro
                  <input type="text" value={form.neighborhood} onChange={(event) => updateField("neighborhood", event.target.value)} />
                </label>

                <label>
                  Cidade
                  <input type="text" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
                </label>

                <label>
                  Estado
                  <input type="text" value={form.state} onChange={(event) => updateField("state", event.target.value)} maxLength={2} />
                </label>
              </div>

              {error ? <p className="usuario-form-card__error">{error}</p> : null}

              <div className="usuario-form-card__actions">
                <button type="submit" className="btn-action btn-action--primary" disabled={saving}>
                  {saving ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Criar usuario"}
                </button>

                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="btn-action btn-action--secondary"
                      onClick={handleToggleStatus}
                      disabled={changingStatus || saving || deleting}
                    >
                      {changingStatus ? "Atualizando..." : user?.is_active ? "Desativar usuario" : "Ativar usuario"}
                    </button>

                    <button type="button" className="btn-action btn-action--danger" onClick={handleDelete} disabled={deleting || changingStatus || saving}>
                      {deleting ? "Excluindo..." : "Excluir usuario"}
                    </button>
                  </>
                ) : null}
              </div>
            </form>

            {isEditing && user ? (
              <section className="usuario-detail-card">
                <div className="usuario-detail-grid">
                  <div>
                    <span className="usuario-detail-label">Nome</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Email</span>
                    <strong>{user.email || "-"}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Telefone</span>
                    <strong>{user.phone || "-"}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">CPF</span>
                    <strong>{user.cpf || "-"}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Nascimento</span>
                    <strong>{formatDate(user.birthdate)}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Cadastro</span>
                    <strong>{formatDate(user.created_at)}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Perfil</span>
                    <strong>{user.role === "admin" ? "Administrador" : "Cliente"}</strong>
                  </div>
                  <div>
                    <span className="usuario-detail-label">Status</span>
                    <strong>{user.is_active ? "Ativo" : "Inativo"}</strong>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
