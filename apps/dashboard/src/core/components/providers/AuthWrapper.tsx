"use client";

import { useEffect } from "react";
import { AuthProvider } from "../../../../context/authContext";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("✅ Hydration check: AuthWrapper mounted on client");
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
