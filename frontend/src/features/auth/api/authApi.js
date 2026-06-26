import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { getMeMock, loginMock, registerMock } from "./authMock";

function normalizeUser(user) {
  return {
    id: user.id,
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: user.phone,
    customer_cpf: user.cpf ?? null,
    role: user.role,
    customer_birthdate: null,
    customer_gender: null,
    baby_name: null,
    baby_birthdate: null,
    zip_code: null,
    street: null,
    number: null,
    neighborhood: null,
    city: null,
    state: null,
    complement: null,
  };
}

export async function login(payload) {
  if (USE_MOCKS.auth) return loginMock(payload);

  const tokenData = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const userData = await apiClient("/usuarios/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  return {
    access_token: tokenData.access_token,
    token_type: "bearer",
    user: normalizeUser(userData),
  };
}

export async function register(payload) {
  if (USE_MOCKS.auth) return registerMock(payload);

  const userData = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const tokenData = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });

  return {
    access_token: tokenData.access_token,
    token_type: "bearer",
    user: normalizeUser(userData),
  };
}

export async function getMe(token) {
  if (USE_MOCKS.users) return getMeMock();

  const userData = await apiClient("/usuarios/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return normalizeUser(userData);
}
