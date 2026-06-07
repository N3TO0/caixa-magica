export function buildOrderPayload({ cartItems, form }) {
  return {
    delivery_type: form.delivery_type,

    payment_type:
      form.payment_type === "card"
        ? "on_delivery_card"
        : form.payment_type === "cash"
        ? "on_delivery_cash"
        : "pending",

    items: cartItems.map((item) => ({
      product_id: item.product_id || item.cart_item_id,
      days: item.days,
      start_date: item.start_date,
      end_date: item.end_date,
    })),

    address_id: form.address_id || null,
    notes: form.notes,
    baby_name: form.baby_name,
    baby_birthdate: form.baby_birthdate,
    origin: "site",
  };
}