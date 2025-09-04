import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="flex flex-col justify-center item-center max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-foreground text-center">
        Create Your Account
      </h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Username" className="w-full" />
        <Input type="email" placeholder="Email" className="w-full" />
        <Input type="password" placeholder="Password" className="w-full" />
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
