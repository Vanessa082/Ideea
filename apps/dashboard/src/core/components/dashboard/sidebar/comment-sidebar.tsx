"use client";

import { MessageSquare, Bell, X, Search, ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 z-[60] h-full w-[350px] bg-background border-l shadow-2xl transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Comments</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Notifications">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} title="Close">
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex p-2 border-b">
        <Button variant="ghost" size="sm" className="flex-1 rounded-full bg-primary/10 text-primary font-semibold">
          All comments
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-full font-normal">
          For you
        </Button>
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-sm">
            All types <ChevronDown size={14} className="ml-1" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-sm">
            All tabs <ChevronDown size={14} className="ml-1" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Search comments">
          <Search size={18} />
        </Button>
      </div>

      <Separator />

      <div className="p-4 flex flex-col items-center justify-center text-center h-[calc(100%-165px)]">
        <div className="my-8">
          <h3 className="text-base font-medium text-foreground">Start a discussion</h3>
          <Button className="mt-2 px-6 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 pointer-events-none" disabled>
            Add comment
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-xs text-muted-foreground border-t pt-3">
          <p className="font-semibold text-center mb-1">Who sees comments?</p>
          <p className="text-center">
            Your comments will be seen by anyone who can comment or edit this document.
          </p>
        </div>
      </div>
    </div>
  );
};