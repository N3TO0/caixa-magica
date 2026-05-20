import { mockDelay } from "@/shared/services/mockDelay";

export const mockOrders = [
  {
    id: 1000,
    status: "pendente",
    total: 180,
    created_at: "2026-05-20",
    items: [
      { product_id: 1, name: "Berço Co-Sleep", days: 30, start_date: "2026-05-22", end_date: "2026-06-21" },
    ],
  },
  {
    id: 999,
    status: "finalizado",
    total: 76,
    created_at: "2026-04-12",
    items: [
      { product_id: 2, name: "Tapete de atividades - Playground", days: 30, start_date: "2026-04-15", end_date: "2026-05-15" },
    ],
  },
];

export function getMockMyOrders() {
  return mockDelay(mockOrders);
}

export function getMockAccount() {
  return mockDelay({ id: 1, name: "Cliente Caixa Mágica", email: "admin@email.com" });
}

export function getMockOrderDetail(orderId) {
  return mockDelay(mockOrders.find(order => order.id === Number(orderId)) || null);
}
