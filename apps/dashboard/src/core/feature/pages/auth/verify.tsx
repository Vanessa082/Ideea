"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function VerifyAccountForm() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-foreground">
        Verify Your Account
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Enter the 6-digit code sent to your email.
      </p>
      <form className="space-y-4">
        <Input type="text" placeholder="Enter verification code" maxLength={6} />
        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
      <p className="text-xs text-muted-foreground text-center">
        Didn’t receive it? <a className="text-primary hover:underline">Resend</a>
      </p>
    </div>
  );
}
