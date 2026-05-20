import "./EmptyState.css";

export default function EmptyState({ title = "Nada encontrado", message = "Tente ajustar os filtros ou buscar outro termo." }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
