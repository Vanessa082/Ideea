import { PublicRoute } from "@/core/components/auth/RouteGuard";
import LoginForm from "@/core/feature/pages/auth/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Idea Login page. Complete sign in process",
};

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
