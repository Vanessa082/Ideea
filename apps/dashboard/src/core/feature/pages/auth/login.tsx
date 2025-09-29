"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";

interface FormData { email: string; password: string; }
interface FormErrors { email?: string; password?: string; general?: string; }

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormErrors]) setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );
      toast.success("Login successful");
      const inviteRedirectUrl = localStorage.getItem("inviteRedirectUrl");
      if (inviteRedirectUrl) {
        localStorage.removeItem("inviteRedirectUrl"); // Clean up
        router.push(inviteRedirectUrl);
      } else {
        router.push("/board"); // Default redirection
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.toLowerCase().includes("email not verified")) {
        setErrors({ general: "Please verify your email before logging in." });
        toast.error("Email not verified. Please check your inbox.");
      } else if (msg.toLowerCase().includes("invalid credentials")) {
        setErrors({ general: "Invalid email or password." });
        toast.error("Invalid email or password.");
      } else {
        setErrors({ general: msg });
        toast.error(msg);
      }
    }

  };

  return (
    <>
      {/* top branding (desktop handled in layout but this is visible on mobile inside the form card) */}
      <div className="hidden md:block text-center">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1">Log in to your ideea account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
        <div>
          <label className="sr-only" htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="sr-only" htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
        </div>

        {errors.general && <p className="text-destructive text-sm mt-1">{errors.general}</p>}

        <div className="flex items-center justify-between">
          <Link href="/auth/forgot" className="text-sm text-muted-foreground hover:underline">Forgot password?</Link>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm hover:shadow-md transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          No account? <Link href="/register" className="text-primary hover:underline">Create one</Link>
        </div>
      </form>
    </>
  );
}
