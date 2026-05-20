import { mockDelay } from "@/shared/services/mockDelay";

export const mockCategories = [
  { id: 1, name: "0-3 meses", slug: "0-3-meses", is_active: true },
  { id: 2, name: "3-6 meses", slug: "3-6-meses", is_active: true },
  { id: 3, name: "Brinquedos", slug: "brinquedos", is_active: true },
];

export const mockProducts = [
  {
    id: 1,
    name: "Berço Co-Sleep",
    slug: "berco-co-sleep",
    description: "Cama compartilhada de forma segura para bebês.",
    type: "rental",
    age_range: "0-3 meses",
    total_units: 3,
    is_featured: true,
    pricing: [
      { id: 1, days: 7, price: "80.00", is_active: true },
      { id: 2, days: 15, price: "120.00", is_active: true },
      { id: 3, days: 30, price: "180.00", is_active: true },
    ],
    images: [{ id: 1, url: "/images/berco.jpg", display_order: 0 }],
    categories: [mockCategories[0]],
  },
  {
    id: 2,
    name: "Tapete de atividades - Playground",
    slug: "tapete-de-atividades-playground",
    description: "Considerado a academia dos bebês, desenvolve todos os sentidos.",
    type: "rental",
    age_range: "3-6 meses",
    total_units: 4,
    is_featured: true,
    pricing: [
      { id: 4, days: 7, price: "38.00", is_active: true },
      { id: 5, days: 15, price: "54.00", is_active: true },
      { id: 6, days: 30, price: "76.00", is_active: true },
    ],
    images: [{ id: 2, url: "/images/tapete.jpg", display_order: 0 }],
    categories: [mockCategories[1], mockCategories[2]],
  },
];

export function getMockProducts() {
  return mockDelay(mockProducts);
}

export function getMockCategories() {
  return mockDelay(mockCategories);
}

export function getMockProductById(productId) {
  const product = mockProducts.find(item => item.id === Number(productId));
  return mockDelay(product || null);
}
