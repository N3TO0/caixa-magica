import { NavLink } from "react-router-dom";
import "../styles/AdminShared.css";

const tabs = [
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminSectionTabs() {
  return (
    <nav className="admin-section-tabs" aria-label="Seções administrativas">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `admin-section-tab${isActive ? " active" : ""}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
