"use client";

import { API_BASE_URL, STORAGE_KEYS } from "@/constants/api";
import { authService } from "@/services/auth";
import { AuthResponse, LoginRequest, RegisterRequest, User, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 1) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = (response: AuthResponse) => {
    setCookie(STORAGE_KEYS.TOKEN, response.token);
    setToken(response.token);

    const userData: User = {
      id: "",
      email: response.email,
      username: response.username,
      role: response.role as UserRole,
    };
    setUser(userData);
    setStoredUser(userData);
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const storedToken = getCookie(STORAGE_KEYS.TOKEN);
      const storedUser = getStoredUser();

      if (cancelled) return;

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsLoading(false);
      } else if (storedToken) {
        setToken(storedToken);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || `${API_BASE_URL}`}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            },
          );
          const data = await res.json();
          if (cancelled) return;
          if (data.success && data.data) {
            setUser(data.data);
            setStoredUser(data.data);
          }
        } catch {
          if (cancelled) return;
          deleteCookie(STORAGE_KEYS.TOKEN);
          setStoredUser(null);
          setToken(null);
        }
        if (!cancelled) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);

    if (response.success && response.data) {
      handleAuthSuccess(response.data);
      return { success: true };
    }

    return {
      success: false,
      message: response.message || response.errorMessage || "Login failed",
    };
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);

    if (response.success && response.data) {
      handleAuthSuccess(response.data);
      return { success: true };
    }

    return {
      success: false,
      message: response.message || response.errorMessage || "Registration failed",
    };
  };

  const logout = () => {
    deleteCookie(STORAGE_KEYS.TOKEN);
    setStoredUser(null);
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
