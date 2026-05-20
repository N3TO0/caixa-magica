export function buildOrderPayload({ cartItems, form }) {
  return {
    delivery_type: form.delivery_type,
    payment_type: form.payment_type,
    items: cartItems.map(item => ({
      product_id: item.product_id,
      days: item.days,
      start_date: item.start_date,
      end_date: item.end_date,
      price_snapshot: item.price_snapshot,
    })),
    address_id: form.delivery_type === "delivery" ? Number(form.address_id || 1) : undefined,
    notes: form.notes || undefined,
    baby_name: form.baby_name || undefined,
    baby_birthdate: form.baby_birthdate || undefined,
    origin: "site",
  };
}
