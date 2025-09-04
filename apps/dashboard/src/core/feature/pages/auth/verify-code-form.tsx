"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function VerifyForm() {
  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-foreground text-center">
        Verify Your Account
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        We’ve sent a verification code to your email. Enter it below to activate your
        account.
      </p>
      <form className="space-y-4">
        <Input type="text" placeholder="Verification Code" className="w-full" />
        <Button type="submit" className="w-full">
          Verify Account
        </Button>
      </form>
      <p className="text-sm text-muted-foreground text-center">
        Didn’t get the email?{" "}
        <a className="text-primary hover:underline" href="#">
          Resend Code
        </a>
      </p>
    </div>
  );
}
