import { mockDelay } from "@/shared/services/mockDelay";

const mockUser = {
  id: 1,

  // Cliente
  customer_name: "Cliente Caixa Mágica",
  customer_email: "admin@email.com",
  customer_cpf: "12345678909",
  customer_phone: "71999999999",
  customer_birthdate: "1990-05-10",
  customer_gender: "Feminino",

  // Bebê
  baby_name: "Maria",
  baby_birthdate: "2024-01-15",

  // Endereço
  zip_code: "40000000",
  street: "Rua Exemplo",
  number: "123",
  neighborhood: "Centro",
  city: "Salvador",
  state: "BA",
  complement: "Apto 101",

  role: "customer",
};

export function loginMock({ email, password }) {
  if (
    email === mockUser.customer_email &&
    password === "123456"
  ) {
    return mockDelay({
      access_token: "mock-token",
      token_type: "bearer",
      user: mockUser,
    });
  }

  return Promise.reject(
    new Error("Email ou senha inválidos")
  );
}

export function registerMock(payload) {
  const newUser = {
    ...mockUser,
    ...payload,
    id: Date.now(),
  };

  return mockDelay({
    access_token: "mock-token",
    token_type: "bearer",
    user: newUser,
  });
}

export function getMeMock() {
  return mockDelay(mockUser);
}