"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";

export default function ClientAcceptInvite({ boardId }: { boardId: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const accept = async () => {
      if (!token || !accessToken) return;

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

        if (res.ok) {
          router.replace(`/board/${boardId}`);
        } else {
          const error = await res.json().catch(() => ({}));
          toast(error.message || "Failed to accept invite");
        }
      } catch (err) {
        console.error("Accept invite failed:", err);
        toast("Something went wrong");
      }
    };

    accept();
  }, [boardId, token, accessToken, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Accepting your invite...</p>
    </div>
  );
}
