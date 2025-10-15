// core/components/dashboard/navbars/file-menu-dropdown.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  FileText,
  FolderOpen,
  Copy,
  Download,
  Share2,
  Table,
  Image as ImageIcon,
  HelpCircle,
  Keyboard,
  Undo2,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { toast } from "sonner";


type MenuItem = {
  label: string;
  icon: any;
  action: () => void;
  shortcut?: string;
}

type MenuSeparator = {
  type: "separator";
}

export type MenuItems = (MenuItem | MenuSeparator)[];


const INSERT_MENU_ITEMS: MenuItems = [
  {
    label: "Image",
    icon: ImageIcon,
    action: () => toast.info("Insert Image: This functionality is also available in the toolbar."),
  },
  {
    label: "Table",
    icon: Table,
    action: () => toast.info("Insert Table clicked!"),
  },
];

const HELP_MENU_ITEMS: MenuItems = [
  {
    label: "Canvas Help",
    icon: HelpCircle,
    action: () => toast.info("Opening help documentation..."),
  },
  {
    label: "Keyboard shortcuts",
    icon: Keyboard,
    action: () => toast.info("Showing shortcuts guide."),
    shortcut: "Ctrl+/",
  },
  { type: "separator" },
  {
    label: "Report a problem",
    icon: Undo2,
    action: () => toast.info("Opening feedback form."),
  },
];


interface DropdownMenuProps {
  label: string;
  items: MenuItems;
}

export const MenuDropdown: React.FC<DropdownMenuProps> = ({ label, items }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="link"
        size="sm"
        className="p-0 h-auto font-normal text-sm hover:text-foreground hover:bg-muted-foreground/10 px-2 py-1 rounded-sm transition-colors"
      >
        {label}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-64">
      {items.map((item, index) => {
        if ("type" in item && item.type === "separator") {
          return <DropdownMenuSeparator key={`sep-${index}`} />;
        }

        // Type assertion for item
        const menuItem = item as MenuItem;
        const Icon = menuItem.icon;

        return (
          <DropdownMenuItem
            key={menuItem.label}
            onClick={menuItem.action}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon size={16} className="text-muted-foreground" />
              {menuItem.label}
            </span>
            {menuItem.shortcut && (
              <span className="text-xs text-muted-foreground ml-4">{menuItem.shortcut}</span>
            )}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);

// --- Main Component ---
interface FileMenuDropdownsProps {
  fileMenuItems: MenuItems; // The dynamic list from Navbar
}

export const FileMenuDropdowns: React.FC<FileMenuDropdownsProps> = ({ fileMenuItems }) => {
  return (
    <div className="flex items-center gap-1">
      <MenuDropdown label="File" items={fileMenuItems} />
      <MenuDropdown label="Insert" items={INSERT_MENU_ITEMS} />
      <MenuDropdown label="Help" items={HELP_MENU_ITEMS} />
    </div>
  );
};