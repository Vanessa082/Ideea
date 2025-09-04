import type { Metadata } from "next";
import RegisterForm from "../../../core/feature/pages/auth/register-form";

export const metadata: Metadata = {
  title: "Registration",
  description: "Ideea registration page. Complete registration process",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
