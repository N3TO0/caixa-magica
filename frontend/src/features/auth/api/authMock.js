import { mockDelay } from "@/shared/services/mockDelay";

const mockUser = {
  id: 1,
  name: "Cliente Caixa Mágica",
  email: "admin@email.com",
  role: "customer",
};

export function loginMock({ email, password }) {
  if (email === "admin@email.com" && password === "123456") {
    return mockDelay({ access_token: "mock-token", token_type: "bearer", user: mockUser });
  }

  return Promise.reject(new Error("Email ou senha inválidos"));
}

export function registerMock(payload) {
  return mockDelay({ access_token: "mock-token", token_type: "bearer", user: { ...mockUser, ...payload, id: 2 } });
}

export function getMeMock() {
  return mockDelay(mockUser);
}
