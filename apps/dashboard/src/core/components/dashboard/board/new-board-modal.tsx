"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import { toast } from "sonner";
import { useAuth } from "../../../../../context/authContext";
import { createBoard } from "../../../../utils/canvasApi";
import { useBoardStore } from "../../../../../store/board-store";

interface NewBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewBoardModal = ({ open, onClose }: NewBoardModalProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { loadUserBoards } = useBoardStore();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const boardUrl = boardId
    ? `${window.location.origin}/board/${boardId}`
    : "";

  const handleCreate = async () => {
    if (!user || !boardName.trim()) return;

    setIsCreating(true);
    try {
      const roomId = uuid();
      await createBoard({
        roomId,
        name: boardName.trim(),
        creator: user.id,
      });

      // Refresh boards list
      await loadUserBoards();

      setBoardId(roomId);
      toast.success("Board created successfully!");
    } catch (error: any) {
      console.error("Failed to create board:", error);
      if (error.message && error.message.includes('401')) {
        toast.error("Session expired. Please log in again.");
        await logout();
        router.push('/login');
      } else {
        toast.error("Failed to create board");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (!boardUrl) return;
    navigator.clipboard.writeText(boardUrl);
    toast.success("Board link copied!");
  };

  const handleOpen = () => {
    if (!boardId) {
      setBoardName("");
    }
  };

  const handleClose = () => {
    setBoardId(null);
    setBoardName("");
    onClose();
  };

  const handleOpenBoard = () => {
    if (!boardId) return;
    handleClose();
    router.push(`/board/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new collaborative board and share the link to invite others.
          </DialogDescription>
        </DialogHeader>

        {!boardId ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-1">
                Board Name
              </label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name"
                disabled={isCreating}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link to invite others:
            </p>
            <div className="flex gap-2">
              <Input value={boardUrl} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                Copy
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {!boardId ? (
            <Button
              onClick={handleCreate}
              disabled={!boardName.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Board"}
            </Button>
          ) : (
            <Button onClick={handleOpenBoard}>
              Open Board
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
