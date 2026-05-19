import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../img/images/logo.png";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();


function pesquisar(e) {
  e.preventDefault();
  if (!busca.trim()) return;
  navigate(`/pesquisa/${encodeURIComponent(busca.trim())}`);
} 

  return (
    <header className="header">
      {/* TOPO */}
      <div className="header-top">
        {/* LOGO */}
           <div className="top-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* BUSCA */}
        <div className="top-center">
  <form onSubmit={pesquisar} className="search-wrapper">
    <span className="icone-lupa">🔍</span>
    <input
      type="text"
      placeholder="Buscar..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
    />
  </form>
</div>

        {/* ÍCONES */}
        <div className="top-right">
          <button 
          className="icon-btn instagram"
            onClick={() =>
            window.open("https://www.instagram.com/caixamagica_", "_blank")
            }
            aria-label="Instagram"
            >
            <FaInstagram />
          </button>

          <button 
          className="icon-btn whatsapp"
           onClick={() =>
            window.open("https://wa.me/5579998112997","_blank"
    )
  }
  aria-label="WhatsApp"
>
  <FaWhatsapp />
          </button>

          <Link to="/login">
  <button className="icon-btn login">
    <FaUser />
  </button>
</Link>

          <button className="icon-btn carrinho">
            <FaShoppingCart />
            {cartItems?.length > 0 && (
  <span className= "cart-badge">{cartItems.length}</span>
)}

  </button>
          {/* BOTÃO MENU MOBILE */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* 🔹 MENU */}
      <nav className={`header-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/quem-somos">QUEM SOMOS</Link>
        <Link to="/como-alugar">COMO ALUGAR</Link>
        <Link to="/produtos">PRODUTOS</Link>
        <Link to="/duvidas">DÚVIDAS</Link>
        <Link to="/contrato">CONTRATO</Link>
      </nav>
    </header>
  );
}
