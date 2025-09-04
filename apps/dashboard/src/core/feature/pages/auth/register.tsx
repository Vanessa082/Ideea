"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function RegisterForm() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground text-center">
        Create Your Account
      </h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Username" />
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Input type="text" placeholder="Team Name (optional)" />
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
      <p className="text-sm text-muted-foreground text-center">
        Already have an account? <a className="text-primary hover:underline">Login</a>
      </p>
    </div>
  );
}
