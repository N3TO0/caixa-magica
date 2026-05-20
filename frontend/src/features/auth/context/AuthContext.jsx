import { createContext, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    setUser(response.user || null);
    setToken(response.access_token || null);
    return response;
  }

  async function register(payload) {
    const response = await registerRequest(payload);
    setUser(response.user || null);
    setToken(response.access_token || null);
    return response;
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(token), login, logout, register, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}
