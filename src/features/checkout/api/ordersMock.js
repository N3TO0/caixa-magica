import { mockDelay } from "@/shared/services/mockDelay";

let nextOrderId = 1000;

export function createMockOrder(payload) {
  const total = payload.items.reduce((sum, item) => sum + Number(item.price_snapshot || 0), 0);

  return mockDelay({
    success: true,
    data: {
      id: nextOrderId++,
      status: "pendente",
      total,
    },
  });
}

export function getMockOrderById(orderId) {
  return mockDelay({
    id: Number(orderId),
    status: "pendente",
    total: 0,
    items: [],
  });
}
