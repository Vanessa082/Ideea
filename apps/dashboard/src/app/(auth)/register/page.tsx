import RegisterForm from "@/core/feature/pages/auth/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration",
  description: "Idea registration page. Complete registration process",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
