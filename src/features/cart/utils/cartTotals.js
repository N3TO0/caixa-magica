export function getCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + Number(item.price_snapshot || 0), 0);
}

export function getCartItemsCount(cartItems) {
  return cartItems.length;
}
