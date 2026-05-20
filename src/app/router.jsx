import { Route, Routes } from "react-router-dom";
import AccountPage from "@/features/account/pages/AccountPage";
import MyOrdersPage from "@/features/account/pages/MyOrdersPage";
import OrderDetailPage from "@/features/account/pages/OrderDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/features/checkout/pages/OrderSuccessPage";
import HomePage from "@/features/home/pages/HomePage";
import AboutPage from "@/features/institutional/pages/AboutPage";
import ContractPage from "@/features/institutional/pages/ContractPage";
import FAQPage from "@/features/institutional/pages/FAQPage";
import HowToRentPage from "@/features/institutional/pages/HowToRentPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import SearchPage from "@/features/search/pages/SearchPage";

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
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/pedido/sucesso/:id" element={<OrderSuccessPage />} />
      <Route path="/minha-conta" element={<AccountPage />} />
      <Route path="/meus-pedidos" element={<MyOrdersPage />} />
      <Route path="/pedidos/:id" element={<OrderDetailPage />} />
    </Routes>
  );
}
