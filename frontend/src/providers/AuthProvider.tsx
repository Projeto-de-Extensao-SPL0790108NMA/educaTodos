import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { me } from "@/services/apiClient";

// Dados do usuário retornado pelo backend
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_staff: boolean;
  is_superuser: boolean;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rotas que não exigem autenticação
const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Carrega dados do usuário e redireciona para /auth/login se não autenticado em rotas protegidas
  const loadUser = async () => {
    try {
      const data = await me();
      setUser(data as User);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);

      // Se não há tokens ou falha ao validar, faz logout completo
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
      document.cookie = "access=; Path=/; Max-Age=0; SameSite=Lax";
      setUser(null);

      // Redireciona para /auth/login se não estiver em rota pública
      if (pathname && !PUBLIC_ROUTES.includes(pathname)) {
        router.push("/auth/login");
      }

      setLoading(false);
    }
  };

  // Valida autenticação a cada mudança de rota
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Limpa tokens, estado e redireciona para /auth/login
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    document.cookie = "access=; Path=/; Max-Age=0; SameSite=Lax";
    setUser(null);
    router.push("/auth/login");
  };

  // Revalida dados do usuário sem redirecionar
  const refreshSession = async () => {
    try {
      const data = await me();
      setUser(data as User);
    } catch (error) {
      console.error("Erro ao revalidar sessão:", error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acessar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}
