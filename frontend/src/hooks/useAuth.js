import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

const BASE_URL = "http://172.16.67.177:4321/users";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { saveSession, clearSession } = useAuthContext();

  const register = async ({ username, email, password }) => {
    console.log("Registering with:", { username, email, password });
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("Registration response:", data);
      if (!response.ok) throw new Error(data.detail || "Registration failed");

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      const profileRes = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const profile = await profileRes.json();
      saveSession(profile, data.access_token);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => clearSession();

  return { login, register, logout, loading, error };
}