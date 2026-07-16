export function buildSaleOrderPayload({ saleCartItems, form }) {
  return {
    delivery_type: form.delivery_type,
    payment_type: form.payment_type,
    address_id: form.address_id || null,
    notes: form.notes || null,
    origin: "site",
    items: saleCartItems.map((item) => ({
      product_id: item.product_id,
      quantity: Math.max(1, Number(item.quantity || 1)),
    })),
  };
}
