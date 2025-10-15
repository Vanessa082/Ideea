"use client";

import { useAuth } from "@/core/hook/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { BoardRole } from "@/core/types/board.types";

export default function RequestAccessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, accessToken } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<BoardRole.VIEWER | BoardRole.COMMENTER | BoardRole.EDITOR>(BoardRole.VIEWER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boardTitle, setBoardTitle] = useState("Board");

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchBoardTitle = async () => {
      try {
        if (!accessToken) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/public/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch board title.");
        const board = await res.json();
        setBoardTitle(board.title);
      } catch (err) {
        console.error("Failed to fetch board title:", err);
        setBoardTitle("Board Not Found");
      }
    };
    fetchBoardTitle();
  }, [id, accessToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isAuthenticated || !accessToken) {
      localStorage.setItem("accessRequestData", JSON.stringify({ boardId: id, email, message, role }));
      router.push(`/login?redirect=board/${id}/request-access`);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${id}/request-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            requestedRole: role,
            message: message || undefined,
            email: email,
          }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit request.");
      }
      toast.success("Access request sent to the board owner.");
      router.push(`/board/${id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Request Access to {boardTitle}</h2>
        <p className="text-sm text-center text-gray-500">
          You need to be a member of this board to view it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAuthenticated && (
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                You will need to log in or create an account to proceed.
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Requested Role</label>
            <Select onValueChange={(v: any) => setRole(v)} value={role}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Add an optional message for the owner..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request Access"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </p>
      </div>
    </div>
  );
}