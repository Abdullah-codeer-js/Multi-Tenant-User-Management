import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem("authToken"))
  );

  useEffect(() => {
    if (!token) return undefined;

    let active = true;

    api
      .get("/auth/profile")
      .then((response) => {
        if (active) setUser(response.data.data);
      })
      .catch((error) => {
        if (!active) return;
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        toast.error(
          error.response?.data?.message ||
            "Your session could not be restored. Please sign in again."
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (email, password, tenantSubdomain) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      subdomain: tenantSubdomain,
    });
    const nextToken = response.data.data?.token;

    if (typeof nextToken !== "string" || nextToken.length === 0) {
      throw new Error("The sign-in response did not include an authentication token.");
    }

    localStorage.setItem("authToken", nextToken);
    setToken(nextToken);
    setUser(response.data.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout");
      }
    } finally {
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    const response = await api.patch("/auth/profile", updates);
    setUser(response.data.data);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
