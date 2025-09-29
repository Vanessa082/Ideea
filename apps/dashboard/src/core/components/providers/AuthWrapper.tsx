"use client";

import { AuthProvider } from "@/core/hook/auth-context";
import { useEffect } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("✅ Hydration check: AuthWrapper mounted on client");
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
