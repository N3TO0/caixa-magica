export function buildOrderPayload({ cartItems, form }) {
  const allowedDays = [7, 15, 30];

  return {
    delivery_type: form.delivery_type,
    payment_type: form.payment_type,

    items: cartItems.flatMap((item) => {
      const quantity = Math.max(1, Number(item.quantity || 1));

      return Array.from({ length: quantity }, () => ({
        product_id: item.product_id,
        days: allowedDays.includes(Number(item.days)) ? Number(item.days) : 7,
        start_date: item.start_date,
        end_date: item.end_date,
      }));
    }),

    address_id: form.address_id || null,
    notes: form.notes || null,
    baby_name: form.baby_name || null,
    baby_birthdate: form.baby_birthdate || null,
    origin: "site",
  };
}
