import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function ResetPasswordForm() {
  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-foreground text-center">
        Reset Password
      </h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Your email" className="w-full" />
        <Button type="submit" className="w-full">
          Send Verification Code
        </Button>
      </form>
    </div>
  );
}
