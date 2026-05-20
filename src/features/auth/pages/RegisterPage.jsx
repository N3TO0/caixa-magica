import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/LoginPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (!form.name || !form.email || !form.password) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate("/");
    } catch (err) {
      setErro(err.message || "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h2>Criar conta</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
        <input type="email" placeholder="Email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
        <input type="password" placeholder="Senha" value={form.password} onChange={(event) => updateForm("password", event.target.value)} />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</button>
      </form>
    </div>
  );
}
