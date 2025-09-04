import type { Metadata } from "next";
import LoginForm from "../../../core/feature/pages/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Ideea Login page. Complete registration process",
};

export default function LoginFormPage() {
  return <LoginForm />;
}
