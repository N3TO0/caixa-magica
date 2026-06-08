import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import Hero from "@/shared/components/Hero";
import { getCartTotal } from "../utils/cartTotals";
import { addDays } from "@/shared/utils/dateUtils";
import "../styles/CartPage.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      product_id: 1,
      name: "Berço Portátil",
      image_url:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600",
      quantity: 1,
      days: 7,
      start_date: new Date().toISOString().split("T")[0],
  end_date: addDays(new Date().toISOString().split("T")[0], 7),
      price_snapshot: 120,
    },
  ]);

  function updateQuantity(id, quantity) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  function updateQuantity(id, quantity) {
  setCartItems(prev =>
    prev.map(item =>
      item.product_id === id ? { ...item, quantity } : item
    )
  );
}

function updateDays(id, days) {
  setCartItems(prev =>
    prev.map(item => {
      if (item.product_id !== id) return item;

      const start = item.start_date;

      return {
        ...item,
        days,
        end_date: addDays(start, days),
      };
    })
  );
}

  function removeFromCart(id) {
    setCartItems((prev) =>
      prev.filter((item) => item.product_id !== id)
    );
  }

  const total = getCartTotal(cartItems);

  return (
    <>
      <Hero
        title="Carrinho"
        subtitle="Revise os itens antes de continuar sua solicitação."
      />

      <main className="cart-page">
        <CartSummary
          itemCount={cartItems.length}
          total={total}
        />

        <section className="cart-items">
          <h2 className="cart-section-title">
            Seu Carrinho
          </h2>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              Seu carrinho está vazio.
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onUpdateDays={updateDays}
              />

            ))
          )}

          <div className="cart-actions">
          <Link to="/produtos" className="secondary-button">
            Adicionar mais produtos
          </Link>
        </div>
        
        </section>
      </main>
    </>
  );
}