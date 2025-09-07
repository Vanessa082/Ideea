"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../../../context/authContext";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("login form submitted");
    e.preventDefault();

    if (!validateForm()) {
      console.log("validation failed");
      return;
    }

    console.log("validation passed");
    setIsSubmitting(true);
    setErrors({});

    try {
      console.log("logging in...");
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("login successful, redirecting to /");
      router.push("/");
    } catch (error) {
      console.log("login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Login failed";

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("email not verified")) {
        setErrors({ general: "Please verify your email before logging in." });
      } else if (errorMessage.toLowerCase().includes("invalid credentials")) {
        setErrors({ general: "Invalid email or password." });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      console.log("login form is no longer submitting");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle premium blobs */}
      <div className="absolute top-1/4 left-1/3 w-[35rem] h-[35rem] rounded-full blur-[120px] bg-[radial-gradient(1200px_600px_at_10%_-10%,_color-mix(in_oklab,_white_60%,_var(--chart-2))_0%,_transparent_60%)] opacity-30 -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] rounded-full blur-[100px] bg-[radial-gradient(1000px_600px_at_90%_0%,_color-mix(in_oklab,_white_60%,_var(--chart-3))_0%,_transparent_55%)] opacity-20 -z-10" />

      {/* Glassmorphic card */}
      <div className="w-full max-w-md p-10 space-y-8 bg-card/70 backdrop-blur-xl rounded-3xl border border-border shadow-md relative z-10">
        <h1 className="text-2xl font-semibold text-foreground text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-destructive text-sm mt-1">{errors.general}</p>
          )}

          <Button type="submit" className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm hover:shadow-md transition"
            disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center">No Account? <Link href="/register">Register</Link></p>
      </div>
    </div>
  );
}