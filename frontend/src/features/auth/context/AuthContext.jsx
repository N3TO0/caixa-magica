import { createContext, useEffect, useState } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../api/authApi";

const AUTH_TOKEN_KEY = "auth_token";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    let isActive = true;

    async function loadUser() {
      try {
        if (isActive) setAuthLoading(true);
        const currentUser = await getMe(token);
        if (isActive) setUser(currentUser);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        if (isActive) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isActive) setAuthLoading(false);
      }
    }

    loadUser();

    return () => {
      isActive = false;
    };
  }, [token]);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    setUser(response.user || null);
    setToken(response.access_token || null);
    if (response.access_token) localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    return response;
  }

  async function register(payload) {
    const response = await registerRequest(payload);
    setUser(response.user || null);
    setToken(response.access_token || null);
    if (response.access_token) localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    return response;
  }

  async function refreshUser() {
    try {
      const currentUser = await getMe(token);
      setUser(currentUser);
    } catch {
      logout();
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  return (
    <AuthContext.Provider value={{ authLoading, isAuthenticated: Boolean(token && user), login, logout, register, refreshUser, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}
