import type { Metadata } from "next";
import LoginForm from "../../../core/feature/pages/auth/login";

export const metadata: Metadata = {
  title: "Login",
  description: "Idea login page. Sign in to your account",
};

export default function LoginPage() {
  return <LoginForm />;
}
