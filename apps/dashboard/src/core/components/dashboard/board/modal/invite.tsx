"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { useAuth } from "@/core/hook/auth-context";
import { toast } from "sonner";
import { Copy, Link, UserPlus, XCircle, Users, Trash2 } from "lucide-react";
import { BoardRole, BoardInvite, BoardMember, AccessRequest } from "@/core/types/board.types";
import { io, Socket } from 'socket.io-client';

interface InviteModalProps {
  boardId: string;
  open: boolean;
  onClose: () => void;
}

export default function InviteModal({ boardId, open, onClose }: InviteModalProps) {
  const { accessToken, user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BoardRole>(BoardRole.VIEWER);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [publicRole, setPublicRole] = useState<BoardRole.VIEWER | BoardRole.COMMENTER>(BoardRole.VIEWER);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [invites, setInvites] = useState<BoardInvite[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);

  const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL;

  const isOwner = members.find(m => m.userId === user?.id)?.role === BoardRole.OWNER;

  const fetchBoardDetails = async () => {
    if (!boardId || !accessToken) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch board details.");
      const board = await res.json();

      setMembers(board.members || []);
      setInvites(board.invites.filter((i: BoardInvite) => i.status === 'pending') || []);
      setAccessRequests(board.accessRequests.filter((r: AccessRequest) => r.status === 'pending') || []);

      const token = board?.publicLink?.token;
      if (token) {
        setPublicLink(`${window.location.origin}/board/${boardId}?token=${token}`);
        setPublicRole(board.publicLink.role ?? BoardRole.VIEWER);
      } else {
        setPublicLink(null);
      }
    } catch (err) {
      console.error("Failed to fetch board:", err);
      toast.error("Failed to fetch board data.");
    }
  };

  useEffect(() => {
    let boardSocket: Socket | null = null;

    if (open && accessToken && REALTIME_URL) {
      fetchBoardDetails();

      boardSocket = io(`${REALTIME_URL}/board`, {
        auth: { token: accessToken },
        transports: ['websocket'],
      });

      boardSocket.on('connect', () => {
        boardSocket?.emit('joinBoard', { boardId });
      });

      boardSocket.on('board.member.added', (payload: any) => {
        if (payload.boardId === boardId) {
          toast.info(`${payload.email || payload.userId} joined the board!`);
          fetchBoardDetails(); // Refetch the member list
        }
      });

      boardSocket.on('board.management.updated', (payload: any) => {
        if (payload.boardId === boardId) {
          fetchBoardDetails(); // Refetch all lists (members, invites, requests)
        }
      });
    }

    return () => {
      // Disconnect when modal closes
      if (boardSocket) {
        boardSocket.disconnect();
      }
    };
  }, [open, boardId, accessToken]);

  const handleApproveAccess = async (requestId: string, requestedRole: BoardRole) => {
    const request = accessRequests.find(r => r._id === requestId);
    if (!request) {
      toast.error("Request not found.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/access-requests/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: request.userId, role: requestedRole }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to approve access request.");
      }
      toast.success("Access request approved.");
      await fetchBoardDetails();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to approve access request.");
    }
  };

  const handleDenyAccess = async (requestId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/access-requests/${requestId}/deny`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to deny access request.");
      }
      toast.success("Access request denied.");
      await fetchBoardDetails();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to deny access request.");
    }
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email,
            role,
            inviterUserName: user?.username,
            inviterEmail: user?.email,
          }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to invite user");
      }
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      await fetchBoardDetails();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublicLink = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/public-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ role: publicLink ? null : publicRole }),
        }
      );
      if (!res.ok) throw new Error("Failed to toggle public link");
      const data = await res.json();
      const token = data?.publicLink?.token;
      if (token) {
        setPublicLink(`${window.location.origin}/board/${boardId}?token=${token}`);
        toast.success("Public link enabled.");
      } else {
        setPublicLink(null);
        toast.success("Public link disabled.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update public link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (user?.id === userId) {
      toast.error("You cannot remove yourself.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error("Failed to remove member.");
      toast.success("Member removed.");
      setMembers(members.filter((m) => m.userId !== userId));
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to remove member.");
    }
  };

  const handleChangeRole = async (targetUserId: string, newRole: BoardRole) => {
    if (user?.id === targetUserId) {
      toast.error("You cannot change your own role.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: targetUserId, role: newRole }),
        }
      );
      if (!res.ok) throw new Error("Failed to change member role.");
      toast.success("Member role changed.");
      setMembers(
        members.map((m) => (m.userId === targetUserId ? { ...m, role: newRole } : m))
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to change role.");
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/board/boards/${boardId}/invites/${inviteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to cancel invite.");
      toast.success("Invite canceled.");
      setInvites(invites.filter((invite) => invite._id !== inviteId));
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to cancel invite.");
    }
  };

  const copyLink = async () => {
    if (!publicLink) return;
    try {
      await navigator.clipboard.writeText(publicLink);
      toast.success("Link copied!");
    } catch (e) {
      toast.error("Failed to copy link.");
    }
  };

  const getMemberDisplayName = (member: BoardMember) => {
    return member.email || `User ID: ${member.userId}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
        </DialogHeader>

        {isOwner && accessRequests.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Users size={16} /> Access Requests
              </h3>
              <div className="space-y-2">
                {accessRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm">{request.requesterEmail}</span>
                      <span className="text-xs text-muted-foreground">Requested: {request.requestedRole}</span>
                      {request.message && (
                        <p className="mt-1 text-xs text-muted-foreground italic">"{request.message}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={request.requestedRole}
                        onValueChange={(newRole: BoardRole) => {
                          handleApproveAccess(request._id, newRole);
                        }}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                          <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                          <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDenyAccess(request._id)}
                        title="Deny"
                      >
                        <XCircle size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-4" />
          </>
        )}

        {/* Section for direct invites */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <UserPlus size={16} /> Invite People
          </h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select value={role} onValueChange={(v: BoardRole) => setRole(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} disabled={loading || !email.trim()}>
              Send
            </Button>
          </div>
        </div>

        <hr className="my-4" />

        {/* Section for public link */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link size={16} /> Anyone with the link
          </h3>
          {publicLink ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input value={publicLink} readOnly />
                <Button variant="ghost" size="icon" onClick={copyLink}>
                  <Copy size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Select
                  value={publicRole}
                  onValueChange={(v: BoardRole.VIEWER | BoardRole.COMMENTER) => setPublicRole(v)}
                >
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                    <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={handleTogglePublicLink}>
                  <XCircle size={16} className="mr-1" />
                  Disable Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={handleTogglePublicLink} disabled={loading}>
                Enable Link
              </Button>
              <Select
                value={publicRole}
                onValueChange={(v: BoardRole.VIEWER | BoardRole.COMMENTER) => setPublicRole(v)}
                disabled={loading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                  <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Section for displaying members and invites */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users size={16} /> People with access
          </h3>
          {members.length > 0 && (
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{getMemberDisplayName(member)}</span>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                  {isOwner && member.role !== BoardRole.OWNER ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(newRole: BoardRole) => handleChangeRole(member.userId, newRole)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                          <SelectItem value={BoardRole.COMMENTER}>Commenter</SelectItem>
                          <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ) : null}
                  {!isOwner && member.userId !== user?.id && member.role !== BoardRole.OWNER && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          {invites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Pending Invites</h4>
              {invites.map((invite) => (
                <div key={invite._id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="italic text-muted-foreground text-sm">{invite.email}</span>
                    <span className="text-xs text-muted-foreground">Pending as {invite.role}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleCancelInvite(invite._id)}>
                    <XCircle size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {members.length === 0 && invites.length === 0 && accessRequests.length === 0 && (
            <div className="text-sm text-muted-foreground text-center">No one has access yet.</div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}