"use client";

import { useState } from "react";
import { EmptyOrg } from "@/core/components/dashboard/emptyorg";
import { NewBoardModal } from "@/core/components/dashboard/board/new-board-modal";
import { ProtectedRoute } from "@/core/components/auth/RouteGuard";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ProtectedRoute>
        <div className="flex-1 h-[calc(100%-80px)] p-5 md:p-10 flex flex-col items-center justify-center space-y-6">
          <EmptyOrg />
         
        </div>

        <NewBoardModal open={open} onClose={() => setOpen(false)} />
      </ProtectedRoute>
    </>
  );
};

export default DashboardPage;
