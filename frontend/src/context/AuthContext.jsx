import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const stored = localStorage.getItem("authUser");

    if (token && stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        return null;
      }
    }

    return null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("authToken")
  );

  const saveSession = (userData, authToken) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authUser", JSON.stringify(userData));

    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        saveSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuthContext must be used inside <AuthProvider>"
    );
  }

  return ctx;
}