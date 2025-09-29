"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";

export default function AcceptInviteModal({ boardId }: { boardId: string }) {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const { accessToken } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(!!inviteToken);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: inviteToken }),
        }
      );
      if (!res.ok) throw new Error("Failed to accept invite");
      toast.success("You’ve joined the board!");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Board</DialogTitle>
          <p>You’ve been invited to join this board. Do you want to accept?</p>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={loading}>
            {loading ? "Joining..." : "Accept"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
