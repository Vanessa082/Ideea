"use client";

import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.6 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-yellow-300/40 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 0.9, opacity: 0.3 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/3 w-[35rem] h-[35rem] bg-yellow-400/30 rounded-full blur-[120px]"
        />
      </div>

      {/* Other accent blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-ping" />
      </div>

      {/* Motion container for the form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-6 space-y-6 bg-card/80 backdrop-blur-md rounded-xl shadow-2xl relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
