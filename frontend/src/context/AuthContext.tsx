// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "../lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Shape retornado pela API (usa "role", não "isAdmin")
interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

function toAuthUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    isAdmin: apiUser.role === "ADMIN",
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tenta restaurar sessão ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get<ApiUser>("/users/me")
      .then((res) => setUser(toAuthUser(res.data)))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setIsLoading(false));
  }, []);

  // Escuta evento de logout forçado (pelo interceptor do axios)
  useEffect(() => {
    const handler = () => {
      setUser(null);
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ user: ApiUser; accessToken: string }>(
      "/auth/login",
      { email, password },
    );
    localStorage.setItem("access_token", data.accessToken);
    setUser(toAuthUser(data.user));
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<{ user: ApiUser; accessToken: string }>(
        "/auth/register",
        { name, email, password },
        { withCredentials: true },
      );
      localStorage.setItem("access_token", data.accessToken);
      setUser(toAuthUser(data.user));
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* silencioso */
    }
    localStorage.removeItem("access_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
