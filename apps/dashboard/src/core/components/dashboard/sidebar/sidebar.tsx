import { NewButton } from "./new-button";
import { Home, Settings, Users, Bell, LogOut } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { ProtectedRoute } from "../../auth/RouteGuard";

export const Sidebar = () => {
  return (
    <ProtectedRoute>
      <aside className="fixed z-[1] left-0 bg-secondary-foreground h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
        {/* New Board */}
        <NewButton />

        {/* Boards List */}

        {/* Navigation */}
        <div className="flex flex-col gap-y-4 mt-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-black bg-white">
              <Home size={20} />
            </Button>
          </Link>

          <Link href="/teams">
            <Button variant="ghost" size="icon" className="text-white">
              <Users size={20} />
            </Button>
          </Link>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell size={20} />
            </Button>
          </Link>

          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-white">
              <Settings size={20} />
            </Button>
          </Link>
        </div>

        {/* Spacer pushes logout to bottom */}
        <div className="flex-1" />

        {/* Logout */}
        <Button variant="ghost" size="icon" className="text-red-400">
          <LogOut size={20} />
        </Button>
      </aside>
    </ProtectedRoute>
  );
};

export default Sidebar;
