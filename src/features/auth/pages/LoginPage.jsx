import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password: senha });
      navigate("/");
    } catch (err) {
      setErro(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h2>Entrar</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>

      <p className="auth-helper">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </div>
  );
}
