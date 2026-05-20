import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../features/home/pages/HomePage";
import AboutPage from "../features/institutional/pages/AboutPage";
import ContractPage from "../features/institutional/pages/ContractPage";
import FAQPage from "../features/institutional/pages/FAQPage";
import HowToRentPage from "../features/institutional/pages/HowToRentPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import SearchPage from "../features/search/pages/SearchPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produtos" element={<ProductsPage />} />
      <Route path="/produtos/:id" element={<ProductDetailPage />} />
      <Route path="/quem-somos" element={<AboutPage />} />
      <Route path="/como-alugar" element={<HowToRentPage />} />
      <Route path="/duvidas" element={<FAQPage />} />
      <Route path="/contrato" element={<ContractPage />} />
      <Route path="/pesquisa/:termo" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
