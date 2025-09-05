"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createBoard as createBoardApi } from "../../../../utils/canvasApi";

interface NewBoardModalProps {
  open: boolean;
  onClose: () => void;
  creator: string;
}

export const NewBoardModal = ({ open, onClose, creator }: NewBoardModalProps) => {
  const router = useRouter();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState<string>("");

  const boardUrl = boardId
    ? `${window.location.origin}/board/${boardId}?invite=${creator}`
    : "";

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;
    try {
      const result = await createBoardApi({ roomId: "", name: boardName, creator });
      setBoardId(result.roomId);
    } catch (error) {
      toast.error("Failed to create board");
    }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>

        {!boardId ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="boardName" className="text-sm font-medium">
                Board Name
              </label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name"
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
            <Button onClick={handleCreateBoard} disabled={!boardName.trim()}>
              Create Board
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Open Board
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};