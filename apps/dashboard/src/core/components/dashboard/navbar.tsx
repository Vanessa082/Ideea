"use client";

import { useState } from "react";
import { Share2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useAuth } from "../../../../context/authContext";
import UserModal from "../ui/user-modal";
import { ProtectedRoute } from "../auth/RouteGuard";

export const Navbar = ({ boardTitle }: { boardTitle?: string }) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (username: string) => {
    if (!username) return "";
    const parts = username.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return username[0].toUpperCase();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <ProtectedRoute>
      <nav className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-background relative">
        {/* Left side: Board title */}
        <div className="flex items-center gap-x-3">
          <h1 className="text-lg font-semibold text-foreground">
            {boardTitle || "Dashboard"}
          </h1>
        </div>
        {/* Middle: Invite + Presence (future) */}

        {/* Collaborators avatars (placeholder) */}
        {/* <div className="flex -space-x-2">
                    <Image
                    src="https://i.pravatar.cc/30?img=1"
                    className="w-8 h-8 rounded-full border border-white" alt={""} />
                    <Image
                    src="https://i.pravatar.cc/30?img=2"
                    className="w-8 h-8 rounded-full border border-white" alt={""} />
                    </div> */}

        {/* Middle: Invite + Presence (future) */}

        {/* Right side: Utilities */}
        <div className="flex items-center gap-x-3">
          <Button className="flex items-center gap-x-2 bg-secondary-foreground">
            <Share2 size={16} />
            Invite
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* User Avatar */}
          {user ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-sm cursor-pointer"
              onClick={toggleModal}
            >
              {getInitials(user.username)}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-black dark:bg-gray-600 cursor-pointer" />
          )}
        </div>

        {isModalOpen && <UserModal onClose={toggleModal} />}
      </nav>
    </ProtectedRoute>
  );
};

export default Navbar;
