import { apiClient } from "@/shared/services/apiClient";
import { USE_MOCKS } from "@/shared/services/apiConfig";
import { getMeMock, loginMock, registerMock } from "./authMock";

export function login(payload) {
  if (USE_MOCKS.auth) return loginMock(payload);

  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload) {
  if (USE_MOCKS.auth) return registerMock(payload);

  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  if (USE_MOCKS.users) return getMeMock();

  return apiClient("/usuarios/me");
}
