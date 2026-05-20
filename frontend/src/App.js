import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";

import Produtos from "./pages/Produtos";
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

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/comoAlugar" element={<ComoAlugar />} />
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