"use client";

import { Home, Settings, Users, Bell, LogOut, MessageCircle } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { ProtectedRoute } from "../../auth/RouteGuard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { useUserPresenceStore } from "@/core/components/dashboard/board/user-presence";
import { UserPresence as UserPresenceType } from "../../../types/board.types";
import { NotificationIcon } from "../board/notification-icon";

export const Sidebar = () => {
  const { users } = useUserPresenceStore();
  const activeUsers = Object.values(users) as UserPresenceType[];

  return (
    <ProtectedRoute>
      <aside className="fixed z-[1] left-0 bg-secondary-foreground h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
        <Link href="/board">
          <Button variant="ghost" size="icon" className="text-black bg-white">
            <Home size={20} />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Users size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {activeUsers.length > 0 ? (
              activeUsers.map((user) => (
                <DropdownMenuItem key={user.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span>{user.name}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No active users
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationIcon />

        <Link href="/settings">
          <Button variant="ghost" size="icon" className="text-white">
            <Settings size={20} />
          </Button>
        </Link>

      </aside>
    </ProtectedRoute>
  );
};

export default Sidebar;
