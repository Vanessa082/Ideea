"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useAuth } from "@/core/hook/auth-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";

interface NewBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewBoardModal = ({ open, onClose }: NewBoardModalProps) => {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const boardUrl =
    boardId && publicToken
      ? `${window.location.origin}/board/${boardId}?token=${publicToken}`
      : "";

  const handleCreate = async () => {
    if (!user || !boardName.trim()) return;

    setIsCreating(true);
    try {
      // 1. Create the board
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: boardName }),
        }
      );

      if (!res.ok) throw new Error("Failed to create board");
      const board = await res.json();
      setBoardId(board._id);

      // 2. Generate a public link with viewer role
      const linkRes = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${board._id}/public-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ role: "viewer" }),
        }
      );

      if (!linkRes.ok) throw new Error("Failed to create public link");
      const linkData = await linkRes.json();
      setPublicToken(linkData.publicLink.token);
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
    if (!boardUrl) return;
    router.push(boardUrl);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setBoardId(null);
      setPublicToken(null);
      setBoardName("");
      setIsCreating(false);
    }
  }, [open]);

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
              <label
                htmlFor="boardName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
            <Button onClick={handleOpenBoard}>Open Board</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
