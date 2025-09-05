"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import EmailVerificationModal from "@/core/components/auth/verificationModal";
import { useAuth } from "../../../../../context/authContext";

interface FormData {
  username: string;
  email: string;
  password: string;
  teamName: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    teamName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const { register } = useAuth();
  const router = useRouter();
  console.log("welcome to regitration page");
  useEffect(() => {
    console.log("RegisterForm mounted! Client JS is running");
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        ...(formData.teamName.trim() && { teamName: formData.teamName.trim() }),
      };

      console.log("→ registrationData:", registrationData);
      const res = await register(registrationData);
      console.log("→ register() resolved:", res);

      // Show verification modal on successful registration
      setShowVerificationModal(true);
      console.log("→ showVerificationModal set to true");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      console.error("→ register error:", error);
      if (errorMessage.toLowerCase().includes("email already registered")) {
        setErrors({ email: "This email is already registered" });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSuccess = () => {
    // User is now logged in after successful verification
    router.push("/"); // or wherever you want to redirect
  };

  const handleModalClose = () => {
    setShowVerificationModal(false);
    // Optionally redirect to login page or keep them on registration
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-foreground text-center mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-sm text-destructive mt-1">{errors.username}</p>
            )}
          </div>

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
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
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
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <Input
              name="teamName"
              type="text"
              placeholder="Team Name (optional)"
              value={formData.teamName}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {errors.general && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive text-center">{errors.general}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>

      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={handleModalClose}
        email={formData.email}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
}
