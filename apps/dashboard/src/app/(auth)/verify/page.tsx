import type { Metadata } from "next";
import VerifyForm from "../../../core/feature/pages/auth/verify-code-form";

export const metadata: Metadata = {
  title: "Verify Account page",
  description: "Ideea verify account page. Complete registration process",
};

export default function VerifyFormPage() {
  return <VerifyForm />;
}
