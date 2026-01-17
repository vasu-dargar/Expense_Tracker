import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "expense_tracker_token";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [user, setUser] = useState(null);

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) localStorage.setItem(STORAGE_KEY, newToken);
    else localStorage.removeItem(STORAGE_KEY);
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      setUser,
      setToken,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}