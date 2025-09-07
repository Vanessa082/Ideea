"use client";

import AuthWrapper from "@/core/components/providers/AuthWrapper";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect system theme preference
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkQuery.addEventListener("change", handler);

    return () => darkQuery.removeEventListener("change", handler);
  }, []);

  return (
    <AuthWrapper>
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark flex items-center justify-center">
          {children}
        </div>
      </div>
    </AuthWrapper>

  );
}
