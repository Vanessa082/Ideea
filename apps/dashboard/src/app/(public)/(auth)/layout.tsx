"use client";

import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Animated yellow brainstorm canvas */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0.4 }}
        animate={{ scale: 1.1, opacity: 0.6 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-yellow-400/40 rounded-full blur-[120px] -z-20"
      />

      {/* Subtle secondary blob for depth */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0.3 }}
        animate={{ scale: 0.9, opacity: 0.5 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/3 w-[35rem] h-[35rem] bg-yellow-300/30 rounded-full blur-[100px] -z-20"
      />

      {/* Glassmorphic form card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 space-y-6 bg-card/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-border relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}