import { CartProvider } from "../features/cart/context/CartContext";
import { FavoritesProvider } from "../features/favorites/context/FavoritesContext";

export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}
