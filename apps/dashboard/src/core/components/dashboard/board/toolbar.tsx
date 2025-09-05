// apps/dashboard/src/components/Toolbar.tsx
"use client";

import { useBoardStore } from "../../../../../store/board-store";
import { Button } from "../../ui/button";
import { Circle, Eraser, Pen, RectangleCircle, RectangleHorizontal, Redo2Icon, Undo2Icon } from "lucide-react";

export const Toolbar = () => {
  const { setTool, setColor, currentTool, undo, redo } = useBoardStore();

  return (
    <div className="flex w-20 h-fit flex-col items-center gap-2 border-r bg-chart-4 p-3 text-white">
      <Button
        size="sm"
        variant={currentTool === "pen" ? "default" : "secondary"}
        onClick={() => setTool("pen")}
      >
        <Pen />
      </Button>
      <Button
        size="sm"
        variant={currentTool === "rectangle" ? "default" : "secondary"}
        onClick={() => setTool("rectangle")}
      >
        <RectangleHorizontal />
      </Button>
      <Button
        size="sm"
        variant={currentTool === "circle" ? "default" : "secondary"}
        onClick={() => setTool("circle")}
      >
        <Circle />
      </Button>
      <Button
        size="sm"
        variant={currentTool === "text" ? "default" : "secondary"}
        onClick={() => setTool("text")}
      >
        T
      </Button>
      <Button
        size="sm"
        variant={currentTool === "eraser" ? "default" : "secondary"}
        onClick={() => setTool("eraser")}
      >
        <Eraser />
      </Button>
      <input
        type="color"
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 rounded-full border-none"
      />
      <div className="flex flex-col gap-2 mt-auto">
        <Button size="sm" onClick={undo}>
          <Undo2Icon />
        </Button>
        <Button size="sm" onClick={redo}>
          <Redo2Icon />
        </Button>
      </div>
    </div>
  );
};