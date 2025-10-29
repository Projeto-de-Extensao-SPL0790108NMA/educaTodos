import React from "react";

export default function AuthLoginLayout({ children }: { children: React.ReactNode }) {
  // Layout do grupo de autenticação: não inclui o MainLayout global
  return <>{children}</>;
}
