import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import {
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSearch,
  FaClipboardList,
  FaHeart,
} from "react-icons/fa";
import logo from "@/assets/images/logo.png";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { isAuthenticated, logout, user } = useAuth();
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  function pesquisar(e) {
    e.preventDefault();
    if (!busca.trim()) return;
    navigate(`/pesquisa/${encodeURIComponent(busca.trim())}`);
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="top-left">
          <Link to="/" className="logo-area" aria-label="Página inicial da Caixa Mágica">
            <img src={logo} alt="Logo" className="logo" />
            <span className="logo-name">caixa mágica</span>
          </Link>
        </div>

        <div className="top-center">
          <form onSubmit={pesquisar} className="search-wrapper">
            <input
              type="search"
              placeholder="Buscar produtos, categorias..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar produtos"
            />
            <button type="submit" aria-label="Buscar">
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="top-right">
          <button 
            className="icon-btn instagram"
            onClick={() =>
              window.open("https://www.instagram.com/caixamagica_", "_blank")
            }
            aria-label="Instagram"
          >
            <FaInstagram />
            <span>Instagram</span>
          </button>

          <button 
            className="icon-btn whatsapp"
            onClick={() =>
              window.open("https://wa.me/5579998112997", "_blank")
            }
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>

          <Link to={isAuthenticated ? "/minha-conta" : "/login"} className="icon-btn login" aria-label="Minha conta">
            <FaUser />
            <span>Conta</span>
          </Link>

          {isAuthenticated ? (
            <Link to="/favoritos" className="icon-btn favoritos" aria-label="Favoritos">
              <FaHeart />
              {favorites?.length > 0 && (
                <span className="cart-badge">{favorites.length}</span>
              )}
              <span>Favoritos</span>
            </Link>
          ) : null}

          {isAuthenticated ? (
            <Link to="/meus-pedidos" className="icon-btn pedidos" aria-label="Meus pedidos">
              <FaClipboardList />
              <span>Pedidos</span>
            </Link>
          ) : null}

          <Link to="/carrinho" className="icon-btn carrinho" aria-label="Carrinho">
            <FaShoppingCart />
            {cartItems?.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
            <span>Carrinho</span>
          </Link>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      <nav className={`header-menu ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Início</NavLink>
        <NavLink to="/quem-somos" onClick={() => setMenuOpen(false)}>Quem somos</NavLink>
        <NavLink to="/como-alugar" onClick={() => setMenuOpen(false)}>Como alugar</NavLink>
        <NavLink to="/produtos" onClick={() => setMenuOpen(false)}>Produtos</NavLink>
        <NavLink to="/duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</NavLink>
        <NavLink to="/contrato" onClick={() => setMenuOpen(false)}>Contrato</NavLink>
        {isAuthenticated && (
          <NavLink to="/minha-conta" onClick={() => setMenuOpen(false)}>Minha conta</NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/admin/pedidos" onClick={() => setMenuOpen(false)}>Admin</NavLink>
        )}
        {isAuthenticated ? (
          <button
            type="button"
            className="header-menu__logout"
            onClick={() => {
              logout();
              setMenuOpen(false);
              navigate("/login", { replace: true });
            }}
          >
            Sair
          </button>
        ) : (
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>Entrar</NavLink>
        )}
      </nav>
    </header>
  );
}
