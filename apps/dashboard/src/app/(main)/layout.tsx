"use client";
import Sidebar from "@/core/components/dashboard/sidebar/sidebar";
import AuthWrapper from "@/core/components/providers/AuthWrapper";
import { usePathname } from "next/navigation";
import { GeneralNavbar } from "@/core/components/dashboard/navbars/general-navbar";
import { Navbar as BoardNavbar } from "@/core/components/dashboard/navbars/navbar";
import { BoardProvider } from "@/core/hook/board-context";
import { useRealtimeNotifications } from "@/core/hook/use-realtime-notifications";

const RealtimeNotificationConnector = () => {
  // This hook connects the user to the /user socket channel 
  // and listens for personal notifications (invites, access responses).
  useRealtimeNotifications();
  return null;
}

const NavbarSwitcher = () => {
  const pathname = usePathname();
  const isBoardDetailPage = pathname.includes("/board/") && pathname.length > "/board/".length;

  if (isBoardDetailPage) {
    return <BoardNavbar />;
  }
  return <GeneralNavbar />;
};

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect system theme preference


  // Determine which navbar to render based on the pathname

  return (
    <AuthWrapper>
      <BoardProvider>
        <RealtimeNotificationConnector />
        <main className="h-full">
          <Sidebar />
          <div className="pl-[60px] h-full">
            <div className="flex h-full">
              <div className="border-l border-gray-300 h-full" />
              <div className="h-full flex-1 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
                <NavbarSwitcher />
                {children}
              </div>
            </div>
          </div>
        </main>
      </BoardProvider>
    </AuthWrapper>
  );

}