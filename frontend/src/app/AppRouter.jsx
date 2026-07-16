import { Route, Routes } from "react-router-dom";
import AccountPage from "@/features/account/pages/AccountPage";
import EditAccountPage from "@/features/account/pages/EditAccountPage";
import MyOrdersPage from "@/features/account/pages/MyOrdersPage";
import OrderDetailPage from "@/features/account/pages/OrderDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/features/checkout/pages/OrderSuccessPage";
import SaleCheckoutPage from "@/features/checkout/pages/SaleCheckoutPage";
import HomePage from "@/features/home/pages/HomePage";
import AboutPage from "@/features/institutional/pages/AboutPage";
import ContractPage from "@/features/institutional/pages/ContractPage";
import FAQPage from "@/features/institutional/pages/FAQPage";
import HowToRentPage from "@/features/institutional/pages/HowToRentPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import SearchPage from "@/features/search/pages/SearchPage";
import CartPage from "@/features/cart/pages/CartPage";
import AdminOrderStatusPage from "@/features/admin/pages/AdminOrderStatusPage";
import AdminOrdersPage from "@/features/admin/pages/AdminOrdersPage";
import AdminProductFormPage from "@/features/admin/pages/AdminProductFormPage";
import AdminProductsPage from "@/features/admin/pages/AdminProductsPage";
import AdminUserDetailPage from "@/features/admin/pages/AdminUserDetailPage";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage";
import FavoritesPage from "@/features/favorites/pages/FavoritesPage";
import { AdminRoute, ProtectedRoute } from "./routes/ProtectedRoute";

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
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/checkout-compra" element={<ProtectedRoute><SaleCheckoutPage /></ProtectedRoute>} />
      <Route path="/pedido/sucesso/:id" element={<OrderSuccessPage />} />
      <Route path="/minha-conta" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/minha-conta/editar" element={<ProtectedRoute><EditAccountPage /></ProtectedRoute>} />
      <Route path="/favoritos" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/meus-pedidos" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
      <Route path="/pedidos/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      <Route path="/carrinho" element={<CartPage />} />
      <Route path="/admin/pedidos/:id/status" element={<AdminRoute><AdminOrderStatusPage /></AdminRoute>} />
      <Route path="/admin/pedidos" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/produtos" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
      <Route path="/admin/produtos/novo" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
      <Route path="/admin/produtos/:id/editar" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/usuarios/novo" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
      <Route path="/admin/usuarios/:id" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
    </Routes>
  );
}
