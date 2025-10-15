"use client";

import { useAuth } from "@/core/hook/auth-context";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BoardDocument } from "@/core/types/board.types";
import InviteModal from "@/core/components/dashboard/board/modal/invite";
import { useBoard } from "@/core/hook/board-context";
import Canvas from "@/core/components/dashboard/board/canvas";
import { CanvasProvider } from "@/core/hook/canvas-context";
import Navbar from "@/core/components/dashboard/navbars/navbar";
import { CommentsSidebar } from "@/core/components/dashboard/sidebar/comment-sidebar";


export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken, isLoading, isAuthenticated } = useAuth();
  const { setBoardTitle } = useBoard();

  const [board, setBoard] = useState<BoardDocument | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false);

  const toggleCommentsSidebar = () => setIsCommentsSidebarOpen((prev) => !prev);

  // Open Invite Modal if query param present
  useEffect(() => {
    if (searchParams.get("action") === "manage-sharing") {
      setIsInviteModalOpen(true);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("action");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  // Fetch Board
  useEffect(() => {
    if (isLoading || !isAuthenticated || !accessToken) return;

    const fetchBoard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

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
    <CanvasProvider boardId={id}>
      <Navbar toggleCommentsSidebar={toggleCommentsSidebar} />

      <div
        className={`transition-all duration-300 ease-in-out h-[calc(100%-112px)] ${isCommentsSidebarOpen ? "mr-[350px]" : "mr-0"
          }`}
      >
        <Canvas boardId={id} />
      </div>

      <InviteModal
        boardId={id}
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      <CommentsSidebar
        isOpen={isCommentsSidebarOpen}
        onClose={toggleCommentsSidebar}
      />
    </CanvasProvider>
  );
}