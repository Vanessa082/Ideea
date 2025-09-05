"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-lg p-8"
      >
        <div className="space-y-6">
          {children}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Idéea — All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
