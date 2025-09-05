"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function ForgotPasswordForm() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-foreground">
        Forgot Password
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Enter your email to receive a reset link.
      </p>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
