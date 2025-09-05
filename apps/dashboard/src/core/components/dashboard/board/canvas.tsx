"use client";

import { useEffect, useRef } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from 'uuid';
import { useBoardStore } from "../../../../../store/board-store";
import { CanvasElement, BoardEvent, Vector2d, UserPresence as UserPresenceType } from "../../../..//core/types/board.types";
import type Konva from "konva";
import socketService from "@/utils/socketService";
import { UserPresence, useUserPresenceStore } from "./user-presence";
import { Toolbar } from "./toolbar";
import { ElementRenderer } from "./element-render";
// import { CommentsPanel } from "./comments";

// Define a type for our Konva Stage and Transformer refs
type KonvaStageRef = Konva.Stage | null;
type KonvaTransformerRef = Konva.Transformer | null;

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const stageRef = useRef<KonvaStageRef>(null);
  const transformerRef = useRef<KonvaTransformerRef>(null);

  const {
    elements,
    addElement,
    currentTool,
    currentColor,
    selectedElementId,
    setSelectedElement,
    updateElement,
    setDrawing,
    isDrawing,
    setElements,
  } = useBoardStore();

  const { addOrUpdateUser } = useUserPresenceStore();

  useEffect(() => {
    socketService.connect();
    if (socketService.socketInstance) {
      socketService.joinBoard(boardId, "some-user-id");

      socketService.socketInstance.on("element:add", (payload: BoardEvent) => {
        addElement(payload.element);
      });

      socketService.socketInstance.on("element:update", (payload: BoardEvent) => {
        updateElement(payload.element);
      });

      socketService.socketInstance.on("presence:update", (users: { [key: string]: UserPresenceType }) => {
        Object.values(users).forEach(user => addOrUpdateUser(user));
      });
    }

    return () => {
      if (socketService.socketInstance) {
        socketService.socketInstance.off("element:add");
        socketService.socketInstance.off("element:update");
        socketService.socketInstance.off("presence:update");
      }
    };
  }, [boardId, elements, addElement, updateElement, setElements, addOrUpdateUser]);

  const getPointerPosition = (stage: Konva.Stage): Vector2d => {
    const position = stage.getPointerPosition();
    return position ? position as Vector2d : { x: 0, y: 0 };
  }

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPosition(stage);

    if (currentTool === 'pen') {
      setDrawing(true);
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'line',
        points: [pos.x, pos.y],
        x: 0, y: 0,
        color: currentColor,
      };
      addElement(newElement);
    } else if (currentTool === 'rectangle') {
      setDrawing(true);
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'rectangle',
        x: pos.x, y: pos.y,
        width: 0, height: 0,
        color: currentColor,
      };
      addElement(newElement);
    } else if (currentTool === 'circle') {
      setDrawing(true);
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'circle',
        x: pos.x, y: pos.y,
        width: 0, height: 0,
        color: currentColor,
      };
      addElement(newElement);
    } else if (currentTool === 'text') {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'text',
        x: pos.x, y: pos.y,
        text: 'Type something...',
        color: currentColor,
      };
      addElement(newElement);
      socketService.sendElementAdd(boardId, newElement);
    }

    const clickedOnEmpty = e.target === stage;
    if (clickedOnEmpty) {
      setSelectedElement(null);
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPosition(stage);
    const latestElement = elements[elements.length - 1];

    if (!latestElement) return;

    let updatedElement: CanvasElement | null = null;
    if (currentTool === 'pen') {
      const newPoints = latestElement.points?.concat([pos.x, pos.y]);
      updatedElement = { ...latestElement, points: newPoints };
    } else if (currentTool === 'rectangle') {
      const newWidth = pos.x - latestElement.x;
      const newHeight = pos.y - latestElement.y;
      updatedElement = { ...latestElement, width: newWidth, height: newHeight };
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - latestElement.x, 2) + Math.pow(pos.y - latestElement.y, 2));
      updatedElement = { ...latestElement, width: radius, height: radius };
    }

    if (updatedElement) {
      setElements(elements.slice(0, elements.length - 1).concat(updatedElement));
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setDrawing(false);
      const latestElement = elements[elements.length - 1];
      if (latestElement && latestElement.type !== 'text') {
        socketService.sendElementAdd(boardId, latestElement);
      }
    }
  };

  const onElementDragEnd = (element: CanvasElement) => {
    socketService.sendElementUpdate(boardId, element);
  };

  useEffect(() => {
    if (selectedElementId) {
      const selectedNode = stageRef.current?.findOne(`#${selectedElementId}`);
      if (selectedNode) {
        transformerRef.current?.nodes([selectedNode]);
        transformerRef.current?.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedElementId]);

  return (
    <div className="flex justify-between overflow-hidden">
      <Toolbar />
      <div className="">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <ElementRenderer onElementClick={(e: KonvaEventObject<MouseEvent>) => {
              const node = e.target;
              if ('id' in node) { // Check if node has an id property
                setSelectedElement(node.id());
              }
              e.cancelBubble = true;
            }} onElementDragEnd={onElementDragEnd} />
            <Transformer ref={transformerRef} />
          </Layer>
          <Layer>
            <UserPresence />
          </Layer>
        </Stage>
      </div>
      {/* <CommentsPanel /> */}
    </div>
  );
}