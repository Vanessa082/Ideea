"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text as KonvaText,
  Group,
  Label,
  Tag,
  Arrow as KonvaArrow,
} from "react-konva";
import Konva from "konva";
import { toast } from "sonner";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";


import { useCanvas } from "@/core/hook/canvas-context";
import { useAuth } from "@/core/hook/auth-context";
import { CanvasElement, ShapeType, Tool, ElementStyle } from "@/core/types/canvas";
import TransformerWrapper from "../../atoms/transformer-wrapper";

/* ---------- helpers & types ---------- */

const ALL_SHAPE_TYPES: ShapeType[] = [
  "rect", "circle", "triangle", "text", "sticky", "line", "arrow", "freehand", "highlighter", "image",
];

const isBox = (t: ShapeType | Tool): t is ShapeType =>
  ["rect", "circle", "triangle", "text", "sticky"].includes(t as ShapeType);

const isPath = (t: ShapeType | Tool): t is ShapeType =>
  ["line", "arrow", "freehand", "highlighter"].includes(t as ShapeType);

const isDrawableShapeTool = (tool: Tool): tool is ShapeType =>
  (ALL_SHAPE_TYPES as Tool[]).includes(tool) && !["image"].includes(tool);


/* ---------- component ---------- */

export default function Canvas({ boardId }: { boardId: string }) {
  const { user } = useAuth();
  const {
    elements,
    addElement,
    updateElement,
    deleteElement,
    selectedId,
    setSelectedId,
    activeTool,
    setActiveTool,
    collaborators,
    exportCanvas,
    updateCursor,
    defaultStyle,
  } = useCanvas();

  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const drawingElementCache = useRef<CanvasElement | null>(null);

  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [isElementBeingDragged, setIsElementBeingDragged] = useState(false);

  // 1. ✅ CRITICAL STATE: Tracks if we have clicked the empty stage with the "pan" tool
  const [isStageDraggableForPan, setIsStageDraggableForPan] = useState(false);

  const currentStyle = defaultStyle as ElementStyle;

  /* ---------------------- Lifecycle & Export ---------------------- */

  useEffect(() => {
    (window as any).triggerKonvaExport = async (format: "png" | "svg") => {
      const stage = stageRef.current;
      if (!stage) return toast.error("Canvas not loaded for export.");
      setSelectedId(null);

      if (format === "png") {
        stage.toImage({
          mimeType: "image/png",
          pixelRatio: 2,
          callback: (img) => {
            const a = document.createElement("a");
            a.href = img.src;
            a.download = `${boardId}-export.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Exported PNG");
          },
        });
      } else {
        exportCanvas(format === "svg" ? "svg" : "png");
      }
    };

    return () => {
      (window as any).triggerKonvaExport = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, exportCanvas]);

  /* ---------------------- HTML Text Editing Overlay ---------------------- */

  useEffect(() => {
    if (!editingTextId) return;

    const el = elements.find((x) => x.id === editingTextId);
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!el || !stage || !container) return;

    const textNode = stage.findOne(`#${editingTextId}`) as Konva.Text | null;
    if (!textNode) return;

    textNode.hide();
    textNode.getLayer()?.draw();

    const absPos = textNode.getAbsolutePosition();
    const scaleFactor = stage.scaleX();
    const rect = container.getBoundingClientRect();

    const textarea = document.createElement("textarea");
    textarea.value = el.data || "";
    textarea.style.position = "absolute";

    // Position the textarea absolutely on the screen
    textarea.style.top = `${absPos.y * scaleFactor + stagePos.y}px`;
    textarea.style.left = `${absPos.x * scaleFactor + stagePos.x}px`;

    // Size and style the textarea to match the Konva text
    textarea.style.width = `${Math.max(50, (el.width ?? 160) * scaleFactor)}px`;
    textarea.style.height = `${Math.max(20, (el.height ?? 40) * scaleFactor)}px`;
    textarea.style.fontSize = `${(el.style?.fontSize ?? 16) * scaleFactor}px`;
    textarea.style.fontFamily = el.style?.fontFamily ?? "Arial";
    textarea.style.padding = "4px";
    textarea.style.margin = "0";
    textarea.style.border = "1px solid rgba(0,0,0,0.2)";
    textarea.style.outline = "none";
    textarea.style.zIndex = "9999";
    textarea.style.background = "white";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight().toString();

    document.body.appendChild(textarea);
    textarea.focus();

    const finish = () => {
      updateElement(editingTextId, { data: textarea.value });
      setEditingTextId(null);
      textarea.remove();
      textNode.show();
      textNode.getLayer()?.draw();
    };

    textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        finish();
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        finish();
      }
    });

    textarea.addEventListener("blur", () => {
      finish();
    });

    return () => {
      const existingTextareas = document.querySelectorAll("textarea");
      existingTextareas.forEach((t) => t.remove());
      if (textNode) {
        textNode.show();
        textNode.getLayer()?.draw();
      }
    };
  }, [editingTextId, elements, updateElement, stagePos, scale]);

  /* ---------------------- Drawing & Move Logic (Throttled) ---------------------- */

  const performMoveUpdate = useCallback((selectedId: string, tool: ShapeType, sx: number, sy: number, canvasPos: { x: number; y: number }) => {
    if (isBox(tool)) {
      updateElement(selectedId, {
        x: Math.min(sx, canvasPos.x),
        y: Math.min(sy, canvasPos.y),
        width: Math.abs(canvasPos.x - sx),
        height: Math.abs(canvasPos.y - sy),
      });
    }
    else if (isPath(tool)) {
      const el = elements.find(e => e.id === selectedId);
      if (!el) return;

      const newPointX = canvasPos.x - sx;
      const newPointY = canvasPos.y - sy;

      let newPoints: number[];

      if (tool === "line" || tool === "arrow") {
        newPoints = [0, 0, newPointX, newPointY];
      }
      else {
        const cachedPoints = drawingElementCache.current?.points || [];
        newPoints = [...cachedPoints, newPointX, newPointY];
      }

      updateElement(selectedId, { points: newPoints });

      if (tool === "freehand" || tool === "highlighter") {
        drawingElementCache.current = { ...el, points: newPoints };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateElement, elements]);

  const throttledMoveUpdate = useMemo(
    () => throttle(performMoveUpdate, 33, { trailing: true }),
    [performMoveUpdate]
  );

  const throttledCursorUpdate = useMemo(
    () => throttle((x: number, y: number) => updateCursor(x, y), 66, { trailing: true }),
    [updateCursor]
  );

  const debouncedSetScale = useMemo(() => debounce(setScale, 50), []);
  const debouncedSetStagePos = useMemo(() => debounce(setStagePos, 50), []);

  /* ---------------------- Drag & Transform Handlers ---------------------- */

  // 2. ✅ HANDLER: Shape Drag Start
  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Crucial: Stop the event from bubbling up and interfering with Stage drag checks.
    e.cancelBubble = true;
    setIsElementBeingDragged(true);
    e.target.moveToTop();
    e.target.getLayer()?.batchDraw();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const id = node.id();
    updateElement(id, { x: node.x(), y: node.y() });

    // 3. ✅ HANDLER: Shape Drag End
    setIsElementBeingDragged(false);
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<any>) => {
    const node = e.target;
    const id = node.id();
    const el = elements.find((x) => x.id === id);
    if (!el) return;

    requestAnimationFrame(() => {
      if (isBox(el.type)) {
        const newW = node.width() * node.scaleX();
        const newH = node.height() * node.scaleY();
        updateElement(id, {
          x: node.x(),
          y: node.y(),
          width: newW,
          height: newH,
          rotation: node.rotation(),
        });
      } else {
        updateElement(id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
        });
      }
      node.scaleX(1);
      node.scaleY(1);
    });
  };

  /* ---------------------- Zoom/Pan ---------------------- */

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current!;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    const mousePoint = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = oldScale * (1 + direction * 0.1);
    const clamped = Math.max(0.2, Math.min(3, newScale));

    const newPos = {
      x: pointer.x - mousePoint.x * clamped,
      y: pointer.y - mousePoint.y * clamped,
    };

    debouncedSetScale(clamped);
    debouncedSetStagePos(newPos);
  };

  /* ---------------------- Rendering Logic ---------------------- */

  const renderShape = (el: CanvasElement) => {
    const style: ElementStyle = {
      ...currentStyle,
      ...(el.style || {}),
    };

    const commonProps = {
      id: el.id,
      x: el.x,
      y: el.y,
      rotation: el.rotation || 0,
      draggable: activeTool === "pointer",
      visible: el.type !== 'text' || el.id !== editingTextId,
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
        setSelectedId(el.id);
        const node = e.target;
        if (node.moveToTop) {
          node.moveToTop();
          node.getLayer()?.batchDraw();
        }
      },
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDblClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (el.type === 'text') {
          setSelectedId(el.id);
          setEditingTextId(el.id);
        }
      },
      // Shapes should only listen when we are in a selection, eraser, or text editing mode.
      listening: activeTool === "pointer" || activeTool === "eraser" || el.type === "text",
    };

    const { x, y, ...rest } = commonProps;

    switch (el.type) {
      case "rect":
      case "sticky":
        return (
          <Rect
            key={el.id}
            x={x}
            y={y}
            {...rest}
            width={el.width ?? 100}
            height={el.height ?? 60}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
            cornerRadius={el.type === "sticky" ? 6 : 0}
          />
        );
      case "circle":
        return (
          <Circle
            key={el.id}
            {...rest}
            x={x + (el.width ?? 80) / 2}
            y={y + (el.height ?? 80) / 2}
            radius={(el.width ?? 80) / 2}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
        );
      case "triangle":
        return (
          <Line
            key={el.id}
            x={x}
            y={y}
            {...rest}
            points={[
              (el.width ?? 100) / 2, 0,
              el.width ?? 100, el.height ?? 80,
              0, el.height ?? 80,
            ]}
            closed
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
        );
      case "text":
        return (
          <KonvaText
            key={el.id}
            x={x}
            y={y}
            {...rest}
            text={el.data ?? "Double-click to edit"}
            width={el.width ?? 160}
            height={el.height ?? 40}
            fontSize={style.fontSize}
            fontFamily={style.fontFamily}
            fill={style.stroke}
            opacity={style.opacity}
          />
        );
      case "line":
        return (
          <Line
            key={el.id}
            x={x}
            y={y}
            {...rest}
            points={el.points ?? []}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            lineCap="round"
            lineJoin="round"
            opacity={style.opacity}
          />
        );
      case "arrow":
        return (
          <KonvaArrow
            key={el.id}
            x={x}
            y={y}
            {...rest}
            points={el.points ?? []}
            pointerLength={10}
            pointerWidth={8}
            fill={style.stroke}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
        );
      case "freehand":
      case "highlighter":
        return (
          <Line
            key={el.id}
            x={x}
            y={y}
            {...rest}
            points={el.points ?? []}
            stroke={style.stroke}
            strokeWidth={el.type === "highlighter" ? (style.strokeWidth ?? 5) * 3 : style.strokeWidth}
            opacity={el.type === "highlighter" ? 0.4 : style.opacity}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
            globalCompositeOperation={el.type === "highlighter" ? "multiply" : "source-over"}
          />
        );
      default:
        return null;
    }
  };

  const renderedElements = useMemo(() => {
    return elements
      .filter(el => el.id !== editingTextId || el.type !== 'text')
      .map(el => renderShape(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, activeTool, selectedId, currentStyle, editingTextId, isElementBeingDragged]);

  /* ---------------------- Collaborators Cursors ---------------------- */

  const renderedCursors = useMemo(() => {
    return collaborators.map(c =>
      c.cursor ? (
        <Group key={c.clientId} x={c.cursor.x} y={c.cursor.y} listening={false}>
          <Line points={[0, 0, 10, 20, 0, 18]} closed fill={c.color} opacity={0.9} />
          <Label x={12} y={20}>
            <Tag
              fill={c.color}
              pointerDirection="left"
              pointerWidth={8}
              pointerHeight={8}
            />
            <KonvaText
              text={c.username}
              fontSize={12}
              padding={6}
              fill="#fff"
            />
          </Label>
        </Group>
      ) : null
    );
  }, [collaborators]);


  /* ---------------------- Stage Interaction Handlers ---------------------- */

  // 3. ✅ CRITICAL HANDLER: Isolates Stage Pan start logic
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const stageTransform = stage.getAbsoluteTransform().copy();
    stageTransform.invert();
    const canvasPos = stageTransform.point(pointerPos);

    if (e.target !== stage) {
      const shapeId = e.target.id();
      if (activeTool === "eraser" && shapeId) {
        deleteElement(shapeId);
        return;
      }
      if (activeTool === "pointer") {
        // Let the shape's onClick/onDragStart handle the event (drag is handled by the shape's own draggable prop)
        return;
      }
    }

    if (e.target === stage) {
      setSelectedId(null);

      if (activeTool === "pan") {
        // Manually enable Stage drag only when pan tool is active and we clicked empty space
        setIsStageDraggableForPan(true);
        return;
      }
      if (activeTool === "pointer") return;
    }

    if (!isDrawableShapeTool(activeTool)) {
      return;
    }

    const shapeType = activeTool;
    const initialWidth = isBox(shapeType) ? 5 : 1;
    const initialHeight = isBox(shapeType) ? 5 : 1;

    const newEl: CanvasElement = {
      id: crypto.randomUUID(),
      type: shapeType,
      creatorId: user?.id || "guest",
      createdAt: Date.now(),
      x: canvasPos.x,
      y: canvasPos.y,
      width: initialWidth,
      height: initialHeight,
      rotation: 0,
      style: {
        ...currentStyle,
        stroke: shapeType === "highlighter" ? "rgba(255, 200, 0, 0.6)" : currentStyle.stroke,
        fill: shapeType === "sticky" ? "#FFFF88" : currentStyle.fill,
      },
      data: shapeType === "text" ? "Double-click to edit" : "",
      points: isPath(shapeType) ? [0, 0] : undefined,
    };

    const addedId = addElement(newEl);
    if (typeof addedId !== 'string') return;

    setSelectedId(addedId);
    isDrawing.current = true;
    startPos.current = canvasPos;
    drawingElementCache.current = newEl;
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const stageTransform = stage.getAbsoluteTransform().copy();
    stageTransform.invert();
    const canvasPos = stageTransform.point(pointerPos);

    if (user?.id) {
      throttledCursorUpdate(canvasPos.x, canvasPos.y);
    }

    if (!isDrawing.current || !selectedId) return;

    const sx = startPos.current.x;
    const sy = startPos.current.y;
    const tool = activeTool as ShapeType;

    throttledMoveUpdate(selectedId, tool, sx, sy, canvasPos);
  };

  // 4. ✅ CRITICAL HANDLER: Stage Pan End/Drawing End
  const handleMouseUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      drawingElementCache.current = null;

      if (isDrawableShapeTool(activeTool)) {
        setActiveTool("pointer");
      }
    }

    // Disable the Stage Pan state on mouse up
    setIsStageDraggableForPan(false);
  };


  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight - 112}
        scaleX={scale}
        scaleY={scale}
        x={stagePos.x}
        y={stagePos.y}

        draggable={isStageDraggableForPan}
        onDragEnd={e => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
          setIsStageDraggableForPan(false); // Reset just in case
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: activeTool === "pointer"
            ? (isElementBeingDragged ? "grabbing" : "default")
            : activeTool === "pan"
              ? (isStageDraggableForPan ? "grabbing" : "grab") // Change cursor based on if drag started
              : "crosshair"
        }}
      >
        <Layer listening={false}>
          {renderedCursors}
        </Layer>

        <Layer>
          {renderedElements}
          <TransformerWrapper
            selectedId={selectedId}
            elements={elements}
            onTransformEnd={handleTransformEnd}
          />
        </Layer>
      </Stage>
    </div>
  );
}