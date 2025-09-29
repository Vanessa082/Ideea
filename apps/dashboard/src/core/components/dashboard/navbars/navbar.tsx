"use client";

import { useState } from "react";
import { Share2, Sun, Moon, Save, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../../ui/button";
import UserModal from "../../ui/user-modal";
import { ProtectedRoute } from "../../auth/RouteGuard";
import { useAuth } from "@/core/hook/auth-context";
import InviteModal from "../board/modal/invite";
import { useParams } from "next/navigation";
import { useBoard } from "@/core/hook/board-context";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const params = useParams();
  const boardId = params.id as string;
  const { boardTitle } = useBoard();


  // --- Modal & Menu State ---
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Helpers ---
  const getInitials = (username: string) => {
    if (!username) return "";
    const parts = username.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : username[0].toUpperCase();
  };

  // --- Actions ---
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleInviteModal = () => setIsInviteModalOpen((prev) => !prev);
  const toggleUserModal = () => setIsUserModalOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <ProtectedRoute>
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-background w-full">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Board Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate pr-4">
                {boardTitle || "Dashboard"}
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-x-2 lg:gap-x-3 flex-shrink-0">
              <Button
                size="sm"
                className="flex items-center gap-x-1.5 bg-secondary-foreground text-xs lg:text-sm px-2 lg:px-3"
                onClick={toggleInviteModal}
              >
                <Share2 size={14} />
                <span className="hidden md:inline">Invite</span>
              </Button>

              <Button
                size="sm"
                // onClick={handleSave}
                className="text-xs lg:text-sm px-2 lg:px-3"
              >
                <Save size={14} className="lg:w-4 lg:h-4 sm:mr-1.5" />
                <span className="hidden md:inline">Save</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              {/* User Avatar */}
              {user ? (
                <div
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-xs lg:text-sm cursor-pointer flex-shrink-0"
                  onClick={toggleUserModal}
                >
                  {getInitials(user.username)}
                </div>
              ) : (
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-black dark:bg-gray-600 cursor-pointer flex-shrink-0" />
              )}
            </div>

            {/* Mobile: Hamburger + Avatar */}
            <div className="sm:hidden flex items-center gap-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                <Menu size={18} />
              </Button>

              {user ? (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-xs cursor-pointer"
                  onClick={toggleUserModal}
                >
                  {getInitials(user.username)}
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-black dark:bg-gray-600 cursor-pointer" />
              )}
            </div>
          </div>

          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="flex items-center gap-x-1.5 bg-secondary-foreground text-xs lg:text-sm px-2 lg:px-3"
                  onClick={() => {
                    toggleInviteModal();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Share2 size={14} />
                  <span>Invite</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    // handleSave();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-x-2 w-full"
                >
                  <Save size={16} />
                  Save
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-x-2 w-full"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {isUserModalOpen && <UserModal onClose={toggleUserModal} />}
        <InviteModal
          boardId={boardId}
          open={isInviteModalOpen}
          onClose={toggleInviteModal}
        />
      </nav>
    </ProtectedRoute>
  );
};

export default Navbar;
