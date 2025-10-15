"use client";

import {
  MousePointer, Hand, ZoomIn, ZoomOut, Square, Circle, Triangle, Minus,
  ArrowRight, Type, StickyNote, Pencil, Highlighter, Link, Laugh,
  ThumbsUp, Timer, Undo2, Redo2, Palette, Download, MessageSquare,
  LayoutTemplate, Eraser, Trash2
} from "lucide-react";
import { Button } from "../../../ui/button";
import { Separator } from "../../../ui/separator";
import { Tool, ToolbarProps } from "@/core/types/canvas";
import { useCanvas } from "@/core/hook/canvas-context";
import { useState } from "react";
import { StylePalette } from "./style-palette";

const ALL_TOOLS: { tool: Tool; icon: any; label: string }[] = [
  { tool: "pointer", icon: MousePointer, label: "Select" },
  { tool: "pan", icon: Hand, label: "Pan" },

  { tool: "undo", icon: Undo2, label: "Undo" },
  { tool: "redo", icon: Redo2, label: "Redo" },

  { tool: "rect", icon: Square, label: "Rect" },
  { tool: "circle", icon: Circle, label: "Circle" },
  { tool: "triangle", icon: Triangle, label: "Triangle" },
  { tool: "line", icon: Minus, label: "Line" },
  { tool: "arrow", icon: ArrowRight, label: "Arrow" },

  { tool: "text", icon: Type, label: "Text" },
  { tool: "sticky", icon: StickyNote, label: "Sticky" },
  { tool: "freehand", icon: Pencil, label: "Pen" },
  { tool: "highlighter", icon: Highlighter, label: "Highlighter" },
  { tool: "eraser", icon: Eraser, label: "Eraser" },

  { tool: "embed", icon: Link, label: "Embed" },

  { tool: "comment", icon: MessageSquare, label: "Comment" },
  { tool: "emoji", icon: Laugh, label: "Emoji" },

  { tool: "template", icon: LayoutTemplate, label: "Template" },
  { tool: "style", icon: Palette, label: "Style" },
  { tool: "export", icon: Download, label: "Export" },

  { tool: "delete", icon: Trash2, label: "Delete" },
];

// Grouping (you can reorder later)
const toolGroups = [
  { tools: ["pointer", "pan", "undo", "redo"] as Tool[], label: "Core" },
  { tools: ["rect", "circle", "triangle", "line", "arrow"] as Tool[], label: "Shapes" },
  { tools: ["text", "sticky", "freehand", "highlighter", "eraser"] as Tool[], label: "Annotate" },
  { tools: ["embed"] as Tool[], label: "Media" },
  { tools: ["comment", "emoji"] as Tool[], label: "Comm" },
  { tools: ["template", "style", "export", "delete"] as Tool[], label: "Utils" },
];

export const Toolbar = ({ onSelectTool, activeTool }: ToolbarProps) => {
  const { undo, redo, deleteElement, selectedId } = useCanvas();
  const [showStylePalette, setShowStylePalette] = useState(false);

  const getTool = (toolName: Tool) => ALL_TOOLS.find(t => t.tool === toolName);

  const handleClick = (tool: Tool) => {
    if (tool === "undo") return undo();
    if (tool === "redo") return redo();
    if (tool === "export") return (window as any).triggerKonvaExport("png");
    if (tool === "delete") return deleteElement(selectedId!);
    onSelectTool(tool);

    if (tool === "style") {
      setShowStylePalette((prev) => !prev);
    } else {
      setShowStylePalette(false);
    }
  };

  return (
    <div className="flex items-center p-1 md:p-1.5 h-12 md:h-14 
                    bg-white dark:bg-gray-800 border-b border-t border-border/80 
                    overflow-x-auto custom-scrollbar shadow-sm">
      {toolGroups.map((group, i) => (
        <div key={group.label} className="flex items-center">
          {group.tools.map(toolName => {
            const tool = getTool(toolName);
            if (!tool) return null;
            const Icon = tool.icon;
            const isActive = activeTool === tool.tool;

            return (
              <Button
                key={tool.tool}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleClick(tool.tool)}
                className="h-8 w-8 p-1.5 md:h-9 md:w-9 md:p-2 rounded-md transition-all"
                title={tool.label}
              >
                <Icon size={18} />
              </Button>
            );
          })}
          {i < toolGroups.length - 1 && (
            <Separator orientation="vertical" className="h-6 mx-1 bg-border/50" />
          )}
        </div>
      ))}
      {showStylePalette && <StylePalette selectedId={selectedId} />}

      {/* Zoom / Timer / Voting */}
      <div className="flex items-center ml-2">
        <Separator orientation="vertical" className="h-6 mx-1 bg-border/50" />
        <Button variant="ghost" size="sm" className="h-8 w-8" title="Zoom In">
          <ZoomIn size={18} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8" title="Zoom Out">
          <ZoomOut size={18} />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1 bg-border/50" />
        <Button variant="ghost" size="sm" className="h-8 w-8" title="Start Timer">
          <Timer size={18} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8" title="Voting">
          <ThumbsUp size={18} />
        </Button>
      </div>
    </div>
  );
};
