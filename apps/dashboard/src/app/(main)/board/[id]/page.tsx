"use client";

import { useAuth } from "@/core/hook/auth-context";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardDocument } from "@/core/types/board.types";
import InviteModal from "@/core/components/dashboard/board/modal/invite";
import { useBoard } from "@/core/hook/board-context";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken, isLoading, isAuthenticated } = useAuth();
  const [board, setBoard] = useState<BoardDocument | null>(null);
  const { setBoardTitle } = useBoard();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'manage-sharing') {
      setIsInviteModalOpen(true);
      // Clean up the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('action');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !accessToken) return;

    const fetchBoard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              // "x-user-id": user?.id as string,
            },
          }
        );

        if (!res.ok) {
          const error = await res.json();
          if (res.status === 403 || res.status === 404) {
            router.replace(`/board/${id}/request-access`);
            return;
          }
          throw new Error(error.message || "Failed to fetch board data.");
        }

        const boardData = await res.json();
        setBoard(boardData);
        setBoardTitle(boardData.title);
      } catch (e: any) {
        toast.error(e.message);
        console.error(e);
      }
    };

    fetchBoard();
  }, [id, user, accessToken, isLoading, isAuthenticated, router, searchParams]);

  if (isLoading || !board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading board...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Board: {board.title}</h1>
      {/* Your existing board content goes here */}

      <InviteModal
        boardId={id}
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}