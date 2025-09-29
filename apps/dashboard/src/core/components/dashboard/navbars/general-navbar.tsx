"use client";

import { Search, Grid, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/core/hook/auth-context";
import { useState } from "react";
import { ProtectedRoute } from "../../auth/RouteGuard";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import UserModal from "../../ui/user-modal";

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
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <LayoutDashboard className="text-blue-600" size={22} />
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 hidden sm:inline">
            Boards
          </span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-2 sm:px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* App Grid */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Grid size={20} />
          </Button>

          {/* User Avatar */}
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

        {/* User modal */}
        {isUserModalOpen && <UserModal onClose={() => setIsUserModalOpen(false)} />}
      </nav>
    </ProtectedRoute>
  );
};
