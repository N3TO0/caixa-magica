import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Recuperação:", email);

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
          Você receberá as instruções de recuperação no seu email. 
        </p>
      )}

      <Link to="/login">
        Voltar para o login
      </Link>
    </div>
  );
}