"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";

export default function AcceptInvitePage() {
  const params = useParams<{ id: string }>();
  const boardId = params.id;

  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken, user, isLoading } = useAuth(); // Add isLoading from useAuth

  useEffect(() => {
    const token = searchParams.get("token");

    if (isLoading) {
      // Wait for the auth state to be hydrated
      return;
    }

    if (!token) {
      toast.error("Invalid invitation link.");
      router.replace("/dashboard");
      return;
    }

    // If the user is authenticated and the token is present, proceed to accept the invite.
    if (user && accessToken) {
      const acceptInvite = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/accept`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ token }),
            }
          );

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to accept invitation.");
          }

          toast.success("Invitation accepted! Welcome to the board.");
          router.replace(`/board/${boardId}`);
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Failed to accept invitation.");
          router.replace("/board");
        }
      };
      acceptInvite();
    } else {
      // If not authenticated, store the invite URL and redirect to login.
      localStorage.setItem("inviteRedirectUrl", window.location.href);
      router.replace("/login");
    }
  }, [boardId, searchParams, accessToken, user, isLoading, router]);

  if (isLoading || !user) {
    // Show a loading state while waiting for auth to hydrate,
    // or if the user is unauthenticated (before redirection)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Processing your invitation...</p>
      </div>
    );
  }

  // This part is only reached if the user is authenticated and the invite is being processed.
  return null;
}