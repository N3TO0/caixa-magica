export function getCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const unit = Number(item.price_snapshot || 0);
    const qty = Number(item.quantity || 1);
    return total + unit * qty;
  }, 0);
}
