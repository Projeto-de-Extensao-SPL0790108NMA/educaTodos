"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.is_staff) {
        router.replace("/visao-geral");
      }
    }
  }, [user, router]);

  return (
    <div>
      <h1>Bem-vindo ao Template</h1>
      <p> Conhecimento Livre.</p>
    </div>
  );
}
