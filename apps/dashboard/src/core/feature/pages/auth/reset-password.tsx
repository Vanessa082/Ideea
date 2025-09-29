"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      // TODO: call reset endpoint
      await new Promise((r) => setTimeout(r, 800));
      setMessage("If this email is registered, a reset link has been sent.");
    } catch {
      setMessage("Failed to send reset link. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="text-center md:hidden">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">We’ll send instructions to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground">Send reset link</Button>
        <div className="text-center text-sm mt-2">Remembered? <Link href="/auth/login" className="text-primary hover:underline">Log in</Link></div>
      </form>
    </>
  );
}
