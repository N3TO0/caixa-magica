import { CartProvider } from "@/features/cart/context/CartContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { FavoritesProvider } from "@/features/favorites/context/FavoritesContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
