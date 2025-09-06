"use client";

import { useState } from "react";
import { Share2, Sun, Moon, Save, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useAuth } from "../../../../context/authContext";
import UserModal from "../ui/user-modal";
import { ProtectedRoute } from "../auth/RouteGuard";
import { useBoardStore } from "../../../../store/board-store";

export const Navbar = ({ boardTitle }: { boardTitle?: string }) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (username: string) => {
    if (!username) return "";
    const parts = username.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : username[0].toUpperCase();
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSave = () => {
    const elements = useBoardStore.getState().elements;
    const boardId = window.location.pathname.split("/").pop() || "";
    import("@/utils/canvasApi").then(({ updateCanvas }) => {
      elements.forEach((element: any) => {
        updateCanvas(boardId, element).catch(console.error);
      });
    });
  };

  return (
    <ProtectedRoute>
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-background w-full">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate pr-4">
                {/* {boardTitle || "Dashboard"} */}
              </h1>
            </div>

            <div className="hidden sm:flex items-center gap-x-2 lg:gap-x-3 flex-shrink-0">
              <Button 
                size="sm" 
                className="flex items-center gap-x-1.5 bg-secondary-foreground text-xs lg:text-sm px-2 lg:px-3"
              >
                <Share2 size={14} className="lg:w-4 lg:h-4" />
                <span className="hidden md:inline">Invite</span>
              </Button>
              
              <Button
                size="sm"
                onClick={handleSave}
                className="text-xs lg:text-sm px-2 lg:px-3"
              >
                <Save size={14} className="lg:w-4 lg:h-4 sm:mr-1.5" />
                <span className="hidden md:inline">Save</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              {/* User Avatar */}
              {user ? (
                <div
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-xs lg:text-sm cursor-pointer flex-shrink-0"
                  onClick={toggleModal}
                >
                  {getInitials(user.username)}
                </div>
              ) : (
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-black dark:bg-gray-600 cursor-pointer flex-shrink-0" />
              )}
            </div>

            {/* Mobile: Hamburger menu */}
            <div className="sm:hidden flex items-center gap-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                <Menu size={18} />
              </Button>
              
              {/* User Avatar - Mobile */}
              {user ? (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-xs cursor-pointer"
                  onClick={toggleModal}
                >
                  {getInitials(user.username)}
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-black dark:bg-gray-600 cursor-pointer" />
              )}
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="flex items-center justify-center gap-x-2 bg-secondary-foreground w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Share2 size={16} />
                  Invite
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => {
                    handleSave();
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
                    setTheme(theme === "dark" ? "light" : "dark");
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
        
        {isModalOpen && <UserModal onClose={toggleModal} />}
      </nav>
    </ProtectedRoute>
  );
};

export default Navbar;