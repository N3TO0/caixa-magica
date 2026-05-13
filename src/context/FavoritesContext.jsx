import { createContext, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(produto) {
    setFavorites(prev =>
      prev.find(p => p.id === produto.id)
        ? prev.filter(p => p.id !== produto.id)
        : [...prev, produto]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}