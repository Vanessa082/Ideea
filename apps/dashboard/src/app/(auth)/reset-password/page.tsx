import type { Metadata } from "next";
import ResetPasswordForm from "../../../core/feature/pages/auth/reset-password";

export const metadata: Metadata = {
  title: "Reset Password page",
  description: "Ideea Reset password page. Complete registration process",
};

export default function ResetPasswordFormPage() {
  return <ResetPasswordForm />;
}
