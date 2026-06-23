import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthPages.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setEnviado(true);
  }

  return (
    <div className="login-container">
      <h2>Recuperar Senha</h2>

      {!enviado ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit">
            Enviar instruções
          </button>
        </form>
      ) : (
        <p>
          A recuperação de senha ainda não está disponível.
        </p>
      )}

      <Link to="/login">
        Voltar para o login
      </Link>
    </div>
  );
}
