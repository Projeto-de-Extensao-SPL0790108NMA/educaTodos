"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    // Lista de rotas permitidas para admins
    const adminAllowedRoutes = ["/visao-geral", "/gestao-alunos", "/gestao-cursos"];
    
    // Se é admin e está tentando acessar uma rota não permitida
    if (user.is_staff) {
      const isAllowedRoute = adminAllowedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + "/")
      );
      
      if (!isAllowedRoute) {
        router.replace("/visao-geral");
      }
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
