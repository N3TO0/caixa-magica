import "./LoadingState.css";

export default function LoadingState({ message = "Carregando..." }) {
  return <div className="loading-state">{message}</div>;
}
