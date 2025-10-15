"use client";

import { useState } from "react";
import { Share2, Save, Menu, Star, MessageSquare } from "lucide-react";
import { ProtectedRoute } from "../../auth/RouteGuard";
import { useAuth } from "@/core/hook/auth-context";
import InviteModal from "../board/modal/invite";
import { useParams } from "next/navigation";
import { useBoard } from "@/core/hook/board-context";
import { Toolbar } from "./tool/toolbar";
import { Button } from "../../ui/button";
import { UserModal } from "../../ui/user-modal";
import { FileMenuDropdowns } from "./tool/file-menu-dropdown";
import { getInitials } from "@/lib/utils";
import { ModeToggle } from "../../theme/mode-toggle";
import { Tool } from "@/core/types/canvas";
import { useCanvas } from "@/core/hook/canvas-context";
import { FILE_MENU_ITEMS_FACTORY } from "../../atoms/file-menu";

interface NavbarProps {
  toggleCommentsSidebar: () => void;
}

export const Navbar = ({ toggleCommentsSidebar }: NavbarProps) => {
  const { user } = useAuth();
  const params = useParams();
  const boardId = params.id as string;
  const { boardTitle, setBoardTitle } = useBoard();

  // --- State for active tool, mocking actual tool usage ---
  const { activeTool, setActiveTool, undo, redo, exportCanvas, isSynced } = useCanvas();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const toggleInviteModal = () => setIsInviteModalOpen((prev) => !prev);
  const toggleUserModal = () => setIsUserModalOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleToolbarSelect = (tool: Tool) => {
    if (tool === 'undo') return undo();
    if (tool === 'redo') return redo();
    // We can map the 'export' tool click to a specific export function, e.g., PNG
    if (tool === 'export') {
      (window as any).triggerKonvaExport('png');
      return;
    }

    setActiveTool(tool);
  }

  const fileMenuItems = FILE_MENU_ITEMS_FACTORY(exportCanvas, undo, redo);

  return (
    <ProtectedRoute>
      <nav className="sticky top-0 z-50 border-b border-border/80 bg-background w-full shadow-md">

        <div className="w-full px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between h-[56px]">

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-extrabold text-chart-5 tracking-tight mr-4 hidden md:block">
              Ideea
            </div>

            {/* Title Display/Edit */}
            <div className="flex items-center gap-1">
              {isTitleEditing ? (
                <input
                  value={boardTitle ?? ""}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  onBlur={() => setIsTitleEditing(false)}
                  autoFocus
                  className="bg-muted px-2 py-1 rounded border border-input text-base font-semibold w-40 truncate"
                />
              ) : (
                <h1
                  className="text-base font-semibold text-foreground truncate cursor-pointer hover:underline"
                  onClick={() => setIsTitleEditing(true)}
                  title="Click to rename"
                >
                  {boardTitle || "Untitled Canvas"}
                </h1>
              )}
              {/* Star Icon (Mimics Docs Star) */}
              <Star size={16} className="text-muted-foreground hover:text-yellow-500 cursor-pointer" />
              <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-medium ${isSynced ? 'bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/50 dark:text-yellow-300'}`}>
                {isSynced ? 'Live Saved' : 'Syncing...'}
              </span>
            </div>

            {/* Hidden File Menu Links (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-3 ml-4 text-sm text-muted-foreground">
              {/* Pass the dynamic items list, including undo/redo/export */}
              <FileMenuDropdowns fileMenuItems={fileMenuItems} />
            </div>
          </div>

          <div className="flex items-center gap-x-2 flex-shrink-0">

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCommentsSidebar} // Use the prop function
                className="p-2 h-9 w-9 hidden sm:flex"
                title="Open Comments"
              >
                <MessageSquare size={18} />
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-x-1.5 bg-primary/90 hover:bg-primary text-white text-xs lg:text-sm px-3"
                onClick={toggleInviteModal}
              >
                <Share2 size={14} />
                <span className="hidden md:inline">Invite</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="text-xs lg:text-sm px-3"
                title="Save"
                disabled={!isSynced} // Disable if not yet synced/connected
              >
                <Save size={14} className="sm:mr-1.5" />
                <span className="hidden md:inline">{isSynced ? 'Saved' : 'Saving...'}</span>
              </Button>

              <ModeToggle />
            </div>

            {/* User Avatar */}
            {user ? (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black dark:bg-gray-600 text-white font-semibold text-xs lg:text-sm cursor-pointer flex-shrink-0"
                onClick={toggleUserModal}
                title={user.username}
              >
                {getInitials(user.username)}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-black dark:bg-gray-600 cursor-pointer flex-shrink-0" />
            )}

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                <Menu size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Toolbar
            activeTool={activeTool}
            onSelectTool={handleToolbarSelect} // Use the context-aware handler
          />
        </div>


        {/* === 3. Mobile Dropdown Menu === */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-[56px] left-0 right-0 z-40 bg-background shadow-lg border-t border-border/80 p-3">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCommentsSidebar}
                className="p-2 h-9 w-9 hidden sm:flex"
                title="Open Comments"
              >
                <MessageSquare size={18} />
              </Button>

              <Button
                size="sm"
                className="flex items-center justify-start gap-x-2 w-full"
                onClick={() => {
                  toggleInviteModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Share2 size={16} />
                <span>Invite Collaborators</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // handleSave();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-start gap-x-2 w-full"
              >
                <Save size={16} />
                Save Canvas
              </Button>

              <ModeToggle />
            </div>
          </div>
        )}

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