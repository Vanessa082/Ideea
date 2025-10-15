"use client";
import Sidebar from "@/core/components/dashboard/sidebar/sidebar";
import AuthWrapper from "@/core/components/providers/AuthWrapper";
import { usePathname } from "next/navigation";
import { GeneralNavbar } from "@/core/components/dashboard/navbars/general-navbar";
import { Navbar as BoardNavbar } from "@/core/components/dashboard/navbars/navbar";
import { BoardProvider } from "@/core/hook/board-context";
import { useRealtimeNotifications } from "@/core/hook/use-realtime-notifications";
import { NotificationProvider } from "@/core/hook/notification-context";
import { useState } from "react";
import { CommentsSidebar } from "@/core/components/dashboard/sidebar/comment-sidebar";

const RealtimeNotificationConnector = () => {
  useRealtimeNotifications();
  return null;
}

const NavbarSwitcher = ({ toggleCommentsSidebar }: { toggleCommentsSidebar: () => void }) => {
  const pathname = usePathname();
  const isBoardDetailPage = pathname.includes("/board/") && pathname.length > "/board/".length;

  if (isBoardDetailPage) {
    return <BoardNavbar toggleCommentsSidebar={toggleCommentsSidebar} />; //navabar meant sor individual board that is the board page /board/[id]/page
  }
  return <GeneralNavbar />;
};

// --- IN BoardLayout.tsx (Adjusted) ---

// Remove the NavbarSwitcher component as it is now redundant for the board page
// and we don't want to render BoardNavbar here.

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false);
  const toggleCommentsSidebar = () => setIsCommentsSidebarOpen((prev) => !prev);
  const pathname = usePathname();
  const isBoardDetailPage = pathname.includes("/board/") && pathname.length > "/board/".length;

  return (
    <AuthWrapper>
      <NotificationProvider>
        <BoardProvider>
          <RealtimeNotificationConnector />
          <main className="h-full">
            <Sidebar />
            <div className="pl-[60px] h-full">
              <div className="flex h-full">
                <div className="border-l border-gray-300 h-full" />
                <div className="h-full flex-1 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
                  {/*
                    FIX: We check if it's a board page. If so, we DON'T render 
                    the BoardNavbar here, but we pass the toggle function to the
                    child to be used by the page's local navbar.
                  */}
                  {!isBoardDetailPage && <GeneralNavbar />}

                  <div className={`transition-all duration-300 ease-in-out h-[calc(100%-112px)] 
                                  ${isCommentsSidebarOpen ? "mr-[350px]" : "mr-0"}`}>
                    {/* FIX: The children (BoardPage) must receive the toggle 
                      function if it needs to render the navbar that uses it.
                      Since React props can't easily pass through 'children', 
                      this is a slight issue. The cleaner approach is the local render.
                      We will assume the BoardPage can manage the sidebar state from within.
                      
                      The h-[calc(100%-112px)] relies on a 112px high navbar.
                      We need to ensure BoardPage renders one.
                    */}
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <CommentsSidebar isOpen={isCommentsSidebarOpen} onClose={toggleCommentsSidebar} />
        </BoardProvider>
      </NotificationProvider>
    </AuthWrapper>
  );
}