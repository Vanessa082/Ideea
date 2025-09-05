"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "../ui/button";
import { useAuth } from "../../../../context/authContext";
import VerificationCodeInput from "./VerifyInput";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess?: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: EmailVerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyEmail, resendVerificationCode } = useAuth();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      await verifyEmail(email, code);
      onSuccess?.();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  }, [
    code,
    email,
    verifyEmail,
    onSuccess,
    onClose,
  ]);

  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code, handleVerify]);

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      await resendVerificationCode(email);
      setResendCooldown(60);
      setCode("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // only call handleClose when it becomes closed
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            We&apos;ve sent a 6-digit verification code to
            <span className="font-medium text-foreground">{email}</span>
          </p>

          <div className="space-y-4">
            <VerificationCodeInput
              value={code}
              onChange={setCode}
              disabled={isVerifying}
            />

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleVerify}
                disabled={code.length !== 6 || isVerifying}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the code?
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0}
                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending
                      ? "Sending..."
                      : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend code"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
