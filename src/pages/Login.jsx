import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    // login fake (simulação)
    if (email === "admin@email.com" && senha === "123456") {
      localStorage.setItem("usuario", email);
      navigate("/");
    } else {
      setErro("Email ou senha inválidos");
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

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}