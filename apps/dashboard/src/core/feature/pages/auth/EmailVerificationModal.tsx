"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/core/hook/auth-context";
import { useRouter } from "next/navigation"; // Correct import for App Router

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function EmailVerificationDialog({
  isOpen,
  onClose,
  email,
}: EmailVerificationDialogProps) {
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { verifyEmail } = useAuth();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Verification code is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await verifyEmail(email, code.trim());

      if (res.accessToken) {
        localStorage.setItem("token", res.accessToken);
        toast.success("Email verified successfully!");

        // This is the correct, self-contained redirection logic
        const inviteRedirectUrl = localStorage.getItem("inviteRedirectUrl");
        if (inviteRedirectUrl) {
          localStorage.removeItem("inviteRedirectUrl"); // Clean up
          router.push(inviteRedirectUrl);
        } else {
          router.push("/board"); // Default redirection
        }
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="mt-4 space-y-4">
          <Input
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="Verification code"
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}