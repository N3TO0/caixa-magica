import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/AuthPages.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", cpf: "", password: "", confirmPassword: "" });
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

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErro("Preencha todos os campos");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErro("As senhas não conferem");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...payload } = form;
      if (!payload.phone.trim()) delete payload.phone;
      if (!payload.cpf.trim()) delete payload.cpf;
      await register(payload);
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
        <input placeholder="Telefone" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
        <input placeholder="CPF" value={form.cpf} onChange={(event) => updateForm("cpf", event.target.value)} />
        <input type="password" placeholder="Senha" value={form.password} onChange={(event) => updateForm("password", event.target.value)} />
        <input type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={(event) => updateForm("confirmPassword", event.target.value)} />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</button>
      </form>
    </div>
  );
}
