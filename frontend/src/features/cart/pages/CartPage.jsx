import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import Hero from "@/shared/components/Hero";
import { getCartTotal } from "../utils/cartTotals";
import { addDays } from "@/shared/utils/dateUtils";
import { useCart } from "../hooks/useCart";
import "../styles/CartPage.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  function updateQuantity(cartItemId, quantity) {
    updateCartItem(cartItemId, { quantity });
  }

  function updateDays(cartItemId, days) {
    const item = cartItems.find((cartItem) => cartItem.cart_item_id === cartItemId);
    if (!item) return;

    updateCartItem(cartItemId, {
      days,
      end_date: addDays(item.start_date, days),
    });
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
                key={item.cart_item_id}
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
