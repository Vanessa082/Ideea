"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import EmailVerificationModal from "@/core/components/auth/verificationModal";
import { useAuth } from "../../../../../context/authContext";
import { createBoard } from "../../../../utils/canvasApi";

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

  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("RegisterForm mounted! Client JS is running");
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        ...(formData.teamName.trim() && { teamName: formData.teamName.trim() }),
      };

      const res = await register(registrationData);

      if (res.accessToken) {
        const roomId = uuid();
        await createBoard({ roomId, name: "Welcome Board", creator: formData.username || formData.email });
        router.push(`/board/${roomId}`);
      } else {
        setShowVerificationModal(true);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      if (msg.toLowerCase().includes("email already registered")) setErrors({ email: "This email is already registered" });
      else setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSuccess = async () => {
    if (user) {
      try {
        const roomId = uuid();
        await createBoard({ roomId, name: "Welcome Board", creator: user.username || user.email });
        router.push(`/board/${roomId}`);
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  const handleModalClose = () => setShowVerificationModal(false);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        {/* Subtle premium blobs */}
        <div className="absolute top-1/4 left-1/3 w-[35rem] h-[35rem] rounded-full blur-[120px] bg-[radial-gradient(1200px_600px_at_10%_-10%,_color-mix(in_oklab,_white_60%,_var(--chart-2))_0%,_transparent_60%)] opacity-30 -z-10" />
        <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] rounded-full blur-[100px] bg-[radial-gradient(1000px_600px_at_90%_0%,_color-mix(in_oklab,_white_60%,_var(--chart-3))_0%,_transparent_55%)] opacity-20 -z-10" />

        {/* Glassmorphic card */}
        <div className="w-full max-w-md p-10 space-y-8 bg-card/70 backdrop-blur-xl rounded-3xl border border-border shadow-md relative z-10">
          <h1 className="text-3xl font-extrabold text-foreground text-center">Create Your Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-primary ${errors.username ? "border-destructive" : ""}`}
              />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
            </div>

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-primary ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-primary ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            <div>
              <Input
                name="teamName"
                type="text"
                placeholder="Team Name (optional)"
                value={formData.teamName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-primary"
              />
            </div>

            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm hover:shadow-md transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
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
