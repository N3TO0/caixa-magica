export function getCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const unit = Number(item.price_snapshot || 0);
    const qty = Number(item.quantity || 1);
    const days = Number(item.days || 7);

    return total + unit * qty * (days / 7);
  }, 0);
}