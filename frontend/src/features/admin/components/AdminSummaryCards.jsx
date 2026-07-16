import "../styles/AdminShared.css";

export default function AdminSummaryCards({ items }) {
  return (
    <section className="admin-summary-grid">
      {items.map((item) => (
        <article className="admin-summary-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
