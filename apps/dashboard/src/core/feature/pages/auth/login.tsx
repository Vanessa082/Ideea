"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function LoginForm() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-foreground">Welcome Back</h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="text-sm text-muted-foreground text-center">
        <a className="hover:underline text-primary">Forgot password?</a>
      </p>
    </div>
  );
}
