import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { formatCpf, formatPhone } from "@/shared/utils/formatUtils";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import "../styles/AuthPages.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", cpf: "", birthdate: "", password: "", confirmPassword: "" });
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

    if (!form.name || !form.email || !form.birthdate || !form.password || !form.confirmPassword) {
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
      notifySuccess("Cadastro realizado com sucesso.");
      navigate("/");
    } catch (err) {
      const message = err.message || "Não foi possível criar sua conta.";
      setErro(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <p className="auth-eyebrow">Cadastro</p>
      <h2>Criar conta</h2>
      <p className="auth-description">
        Preencha seus dados para acompanhar pedidos, salvar informacoes da conta e agilizar suas proximas locacoes.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="auth-grid">
          <input placeholder="Nome" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
          <input type="email" placeholder="Email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
          <input placeholder="Telefone" value={form.phone} onChange={(event) => updateForm("phone", formatPhone(event.target.value))} />
          <input placeholder="CPF" value={form.cpf} onChange={(event) => updateForm("cpf", formatCpf(event.target.value))} />
          <label className="auth-date-field">
            <span>Data de nascimento</span>
            <input type="date" value={form.birthdate} onChange={(event) => updateForm("birthdate", event.target.value)} />
          </label>
          <input type="password" placeholder="Senha" value={form.password} onChange={(event) => updateForm("password", event.target.value)} />
          <input type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={(event) => updateForm("confirmPassword", event.target.value)} />
        </div>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</button>
      </form>
    </div>
  );
}
