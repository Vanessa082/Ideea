"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function VerifyAccountForm() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Your account has been verified successfully!");
    } catch (error) {
      setMessage("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    // Replace with resend logic
    setMessage("Verification code resent to your email.");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-[35rem] h-[35rem] rounded-full blur-[120px] bg-[radial-gradient(1200px_600px_at_10%_-10%,_color-mix(in_oklab,_white_60%,_var(--chart-2))_0%,_transparent_60%)] opacity-30 -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] rounded-full blur-[100px] bg-[radial-gradient(1000px_600px_at_90%_0%,_color-mix(in_oklab,_white_60%,_var(--chart-3))_0%,_transparent_55%)] opacity-20 -z-10" />

      {/* Glassmorphic card */}
      <div className="w-full max-w-md p-10 space-y-6 bg-card/70 backdrop-blur-xl rounded-3xl border border-border shadow-md relative z-10">
        <h1 className="text-3xl font-extrabold text-foreground text-center">
          Verify Your Account
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter verification code"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
            disabled={isSubmitting}
            className="rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-primary text-center tracking-widest"
          />

          {message && (
            <p className="text-sm text-center text-muted-foreground">{message}</p>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm hover:shadow-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Didn’t receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
