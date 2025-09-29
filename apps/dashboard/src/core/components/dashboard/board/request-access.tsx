"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Textarea } from "@/core/components/ui/textarea";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { BoardRole } from "@/core/types/board.types";

interface RequestAccessProps {
  boardId: string;
  isRequestPending: boolean;
}

export default function RequestAccess({ boardId, isRequestPending }: RequestAccessProps) {
  const [showForm, setShowForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestedRole, setRequestedRole] = useState<BoardRole>(BoardRole.VIEWER);
  const { user, accessToken } = useAuth();

  const handleRequest = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/request-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            requestedRole: requestedRole,
            message: requestMessage,
            email: user.email,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send access request.");
      }

      toast.success("Access request sent successfully!");
      setIsSubmitting(false);
      setShowForm(false);
    } catch (err) {
      console.error("Request access error:", err);
      toast.error("Failed to send access request.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-muted-foreground mb-6">
        You don't have permission to view this board.
      </p>

      {isRequestPending ? (
        <p className="text-sm text-gray-500">
          An access request is already pending. The board owner has been notified.
        </p>
      ) : (
        <>
          <Button
            onClick={() => setShowForm(true)}
            className="mb-4"
            disabled={showForm}
          >
            Request Access
          </Button>

          {showForm && (
            <div className="w-full max-w-sm space-y-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Request Role:</label>
                <Select onValueChange={(value: BoardRole) => setRequestedRole(value)} defaultValue={BoardRole.VIEWER}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                    <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                    <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Enter a message for the board owner (optional)"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
              <Button onClick={handleRequest} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}