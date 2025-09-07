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
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import { toast } from "sonner";
import { useAuth } from "../../../../../context/authContext";

interface NewBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewBoardModal = ({ open, onClose }: NewBoardModalProps) => {
  const router = useRouter();
  const { user } = useAuth(); // Get current user
  const [boardId, setBoardId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const boardUrl = boardId ? `${window.location.origin}/board/${boardId}` : "";

  const handleCreate = async () => {
    if (!user || !boardName.trim()) return;

    setIsCreating(true);
    try {
      const newBoardId = uuid();

      // Mock board creation
      console.log("Creating board with:", {
        id: newBoardId,
        name: boardName.trim(),
        creatorId: user.id,
      });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBoardId(newBoardId);
      toast.success("Board created successfully!");
    } catch (error) {
      console.error("Failed to create board:", error);
      toast.error("Failed to create board");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (!boardUrl) return;
    navigator.clipboard.writeText(boardUrl);
    toast.success("Board link copied!");
  };

  const handleOpenBoard = () => {
    if (!boardId) return;
    onClose();
    router.push(`/board/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
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
            <Button onClick={handleCreate} disabled={!boardName.trim() || isCreating}>
              {isCreating ? "Creating..." : "Create Board"}
            </Button>
          ) : (
            <Button onClick={handleOpenBoard}>Open Board</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
