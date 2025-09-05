"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/core/components/dashboard/sidebar/sidebar";
import { Navbar } from "@/core/components/dashboard/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes to exclude from Sidebar + Navbar
  const excludedRoutes = ["/login", "/register", "/reset-password", "/verify"];
  const isExcluded = excludedRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className="antialiased">
        {isExcluded ? (
          // just render children (auth pages etc.)
          <main className="h-full">{children}</main>
        ) : (
          // dashboard layout
          <main className="h-full">
            <Sidebar />
            <div className="pl-[60px] h-full">
              <div className="flex h-full">
                <div className="border-l border-gray-300 h-full" />
                <div className="h-full flex-1">
                  <Navbar />
                  {children}
                </div>
              </div>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}
