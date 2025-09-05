"use client";

import { useState } from "react";
import { Button } from "../core/components/ui/button";
import { EmptyOrg } from "@/core/components/dashboard/emptyorg";
import { NewBoardModal } from "@/core/components/dashboard/board/new-baord-modal";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex-1 h-[calc(100%-80px)] p-5 flex flex-col items-center justify-center space-y-6">
        <EmptyOrg />
        <Button size="lg" onClick={() => setOpen(true)}
        >
          + Start New Board
        </Button>
      </div>

      <NewBoardModal open={open} onClose={() => setOpen(false)} />

    </>
  );
};

export default DashboardPage;
