import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import ComoAlugar from "../pages/ComoAlugar";
import Contrato from "../pages/Contrato";
import Duvidas from "../pages/Duvidas";
import Login from "../pages/Login";
import Pesquisa from "../pages/Pesquisa";
import ProdutoDetalhe from "../pages/ProdutoDetalhe";
import Produtos from "../pages/Produtos";
import QuemSomos from "../pages/QuemSomos";

export default function AppRouter() {
  return (
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
  );
}
