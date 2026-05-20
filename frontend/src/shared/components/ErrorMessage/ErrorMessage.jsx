import "./ErrorMessage.css";

export default function ErrorMessage({ message = "Não foi possível carregar as informações." }) {
  return <div className="error-message">{message}</div>;
}
