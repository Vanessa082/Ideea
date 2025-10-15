import { MenuItems } from "@/core/types/tools";
import { Download, Menu, Redo2, Undo2 } from "lucide-react";

export const FILE_MENU_ITEMS_FACTORY = (
  onExport: (f: 'json' | 'svg' | 'png') => void,
  onUndo: () => void,
  onRedo: () => void
): MenuItems => [
    { label: "New Canvas", icon: Menu, action: () => { } /* ToDo: New Board logic */, shortcut: "Ctrl+Alt+N" },
    { type: "separator" },
    { label: "Undo", icon: Undo2, action: onUndo, shortcut: "Ctrl+Z" },
    { label: "Redo", icon: Redo2, action: onRedo, shortcut: "Ctrl+Y" },
    { type: "separator" },
    { label: "Download as PNG", icon: Download, action: () => (window as any).triggerKonvaExport('png'), shortcut: "Ctrl+Shift+P" },
    { label: "Download as JSON", icon: Download, action: () => onExport('json'), shortcut: "Ctrl+S" },
  ];