import { CartProvider } from "@/features/cart/context/CartContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { FavoritesProvider } from "@/features/favorites/context/FavoritesContext";
import { SaleCartProvider } from "@/features/saleCart/context/SaleCartContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SaleCartProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </SaleCartProvider>
      </CartProvider>
    </AuthProvider>
  );
}
