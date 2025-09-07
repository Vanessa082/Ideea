"use client";                     
import Sidebar from "@/core/components/dashboard/sidebar/sidebar";
import { Navbar } from "@/core/components/dashboard/navbar";
import AuthWrapper from "@/core/components/providers/AuthWrapper";
import { useEffect, useState } from "react";


export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <main className="h-full">
        <Sidebar />
        <div className="pl-[60px] h-full">
          <div className="flex h-full">
            {/* Separator */}
            <div className="border-l border-gray-300 h-full" />
            <div className="h-full flex-1 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
              <Navbar />
              {children}
            </div>
          </div>
        </div>
      </main>
    </AuthWrapper>
  );
}
