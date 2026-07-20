const STATUS_LABELS = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_uso: "Em uso",
  devolvido: "Devolvido",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
  atrasado: "Atrasado",
};

const DELIVERY_TYPE_LABELS = {
  pickup: "Retirada na loja",
  delivery: "Entrega",
};

const PAYMENT_TYPE_LABELS = {
  on_delivery_cash: "Dinheiro na entrega/retirada",
  on_delivery_card: "Cartao na entrega/retirada",
  pending: "Pagamento pendente",
  pix: "Pix",
};

export function getStatusLabel(value) {
  return STATUS_LABELS[value] || value || "-";
}

export function getStatusTone(value) {
  const tones = {
    pendente: "warning",
    confirmado: "info",
    em_uso: "success",
    devolvido: "neutral",
    finalizado: "success",
    cancelado: "danger",
    atrasado: "danger",
  };

  return tones[value] || "neutral";
}

export function getDeliveryTypeLabel(value) {
  return DELIVERY_TYPE_LABELS[value] || value || "-";
}

export function getPaymentTypeLabel(value) {
  return PAYMENT_TYPE_LABELS[value] || value || "-";
}
