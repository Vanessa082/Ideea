"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import EmailVerificationDialog from "./EmailVerificationModal";
import { useAuth } from "@/core/hook/auth-context";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", teamName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.username.trim()) e.username = "Username is required";
    else if (formData.username.length < 3) e.username = "Username must be at least 3 characters";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email address";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        ...(formData.teamName.trim() && { teamName: formData.teamName.trim() }),
      };

      const res = await register(payload);

      if (res.accessToken) {
        localStorage.setItem("token", res.accessToken);
        const inviteRedirectUrl = localStorage.getItem("inviteRedirectUrl");
        if (inviteRedirectUrl) {
          localStorage.removeItem("inviteRedirectUrl"); // Clean up
          router.push(inviteRedirectUrl);
        } else {
          router.push("/board"); // Default redirection
        }
      } else {
        setRegisteredEmail(formData.email.trim().toLowerCase());
        setShowVerificationModal(true);
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      if (msg.toLowerCase().includes("email already registered")) {
        setErrors({ email: "This email is already registered" });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input name="username" placeholder="Username" value={formData.username} onChange={handleInput} />
        {errors.username && <p className="text-destructive text-sm">{errors.username}</p>}

        <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInput} />
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInput} />
        {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}

        <Input name="teamName" placeholder="Team name (optional)" value={formData.teamName} onChange={handleInput} />

        {errors.general && <p className="text-destructive text-sm">{errors.general}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>

      <EmailVerificationDialog
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={registeredEmail}
      />
    </>
  );
}