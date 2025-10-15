"use client";

import { useAuth } from "@/core/hook/auth-context";
import { useState } from "react";
import { ProtectedRoute } from "../../auth/RouteGuard";
import UserModal from "../../ui/user-modal";
import { ModeToggle } from "../../theme/mode-toggle";

export const GeneralNavbar = () => {
  const { user } = useAuth();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const getInitials = (username: string) => {
    if (!username) return "";
    const parts = username.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : username[0].toUpperCase();
  };

  return (
    <ProtectedRoute>
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 hidden sm:inline">
            Boards
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-x-2">
          <ModeToggle />
          {user ? (
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm cursor-pointer"
              onClick={() => setIsUserModalOpen(true)}
            >
              {getInitials(user.username)}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-400" />
          )}
        </div>

        {isUserModalOpen && <UserModal onClose={() => setIsUserModalOpen(false)} />}
      </nav>
    </ProtectedRoute>
  );
};
