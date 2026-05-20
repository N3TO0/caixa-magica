import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";

import Produtos from "./pages/Produtos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import QuemSomos from "./pages/QuemSomos";
import ComoAlugar from "./pages/ComoAlugar";
import Duvidas from "./pages/Duvidas";
import Contrato from "./pages/Contrato";
import Pesquisa from "./pages/Pesquisa";
import Login from "./pages/Login";

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Header />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/como-alugar" element={<ComoAlugar />} />
              <Route path="/duvidas" element={<Duvidas />} />
              <Route path="/contrato" element={<Contrato />} />
              <Route path="/pesquisa/:termo" element={<Pesquisa />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
