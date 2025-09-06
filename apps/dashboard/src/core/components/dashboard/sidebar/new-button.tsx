"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { NewBoardModal } from "../board/new-board-modal";

export const NewButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                size="icon"
                className="rounded-full"
                onClick={() => setOpen(true)}
            >
                <Plus className="h-5 w-5" />
            </Button>
            <NewBoardModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};
