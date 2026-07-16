import { apiClient } from "@/shared/api/apiClient";
import { formatCpf, formatPhone } from "@/shared/utils/formatUtils";

function normalizeUser(user) {
  return {
    id: user.id,
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: formatPhone(user.phone),
    customer_cpf: formatCpf(user.cpf),
    role: user.role,
    customer_birthdate: user.birthdate ?? null,
    profile_photo: user.profile_photo ?? null,
    zip_code: user.zip_code ?? null,
    street: user.street ?? null,
    number: user.number ?? null,
    complement: user.complement ?? null,
    neighborhood: user.neighborhood ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
  };
}

export async function login(payload) {
  const authData = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    access_token: authData.access_token,
    token_type: authData.token_type,
    user: normalizeUser(authData.user),
  };
}

export async function register(payload) {
  const authData = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    access_token: authData.access_token,
    token_type: authData.token_type,
    user: normalizeUser(authData.user),
  };
}

export async function getMe(token) {
  const userData = await apiClient("/usuarios/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return normalizeUser(userData);
}
