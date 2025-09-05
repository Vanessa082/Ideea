"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { toast } from "sonner";

/**
 * Mocks the backend API call to create a new board.
 * In a real application, this would send an API request and return a board ID from the server.
 */
async function createBoard(): Promise<string> {
  return uuid();
}

interface NewBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewBoardModal = ({ open, onClose }: NewBoardModalProps) => {
  const router = useRouter();
  const [boardId, setBoardId] = useState<string | null>(null);
<<<<<<< Updated upstream

  const boardUrl = boardId
    ? `${window.location.origin}/board/${boardId}`
    : "";

  const handleOpen = async () => {
    const id = await createBoard();
    setBoardId(id);
=======
  const [boardName, setBoardName] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const boardUrl = inviteLink || (boardId
    ? `${window.location.origin}/board/${boardId}?invite=${creator}`
    : "");

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;
    try {
      const result = await createBoardApi({ roomId: "", name: boardName, creator });
      setBoardId(result.roomId);
      if (result.inviteLink) {
        setInviteLink(result.inviteLink);
      }
    } catch (error) {
      toast.error("Failed to create board");
    }
>>>>>>> Stashed changes
  };

  const copyToClipboard = () => {
    if (!boardUrl) return;
    navigator.clipboard.writeText(boardUrl);
    toast.success("Board link copied!");
  };

  const handleCreate = () => {
    if (!boardId) return;
    onClose();
    router.push(`/board/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>

        {boardId ? (
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
        ) : (
          <p>Generating link...</p>
        )}

        <DialogFooter>
          <Button onClick={handleCreate} disabled={!boardId}>
            Create & Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};