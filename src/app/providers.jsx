import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";

export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}
