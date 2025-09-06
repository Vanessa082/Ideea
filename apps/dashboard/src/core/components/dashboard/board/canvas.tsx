"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from 'uuid';
import { useBoardStore } from "../../../../../store/board-store";
import { CanvasElement, BoardEvent, Vector2d, UserPresence as UserPresenceType } from "../../../..//core/types/board.types";
import type Konva from "konva";
import socketService from "../../../../utils/socketService";
import { UserPresence, useUserPresenceStore } from "./user-presence";
import { Toolbar } from "./toolbar";
import { ElementRenderer } from "./element-render";

// Define a type for our Konva Stage and Transformer refs
type KonvaStageRef = Konva.Stage | null;
type KonvaTransformerRef = Konva.Transformer | null;

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const stageRef = useRef<KonvaStageRef>(null);
  const transformerRef = useRef<KonvaTransformerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Track if we're currently drawing to prevent duplicate events
  const currentlyDrawingRef = useRef<string | null>(null);

  // Text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>('');
  const [editingTextPosition, setEditingTextPosition] = useState({ x: 0, y: 0 });

  // Eraser state
  const lastErasedRef = useRef<string | null>(null);

  // Line/arrow start position
  const [lineStart, setLineStart] = useState<Vector2d | null>(null);

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

  // Update dimensions on window resize and initial load
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      } else {
        // Fallback dimensions
        setDimensions({
          width: Math.max(320, window.innerWidth - 320), // Account for toolbar width
          height: Math.max(400, window.innerHeight - 120), // Account for navbar height
        });
      }
    };

    updateDimensions();
    
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load initial board from REST API
  useEffect(() => {
    useBoardStore.getState().loadBoard(boardId);
  }, [boardId]);

  // Memoize the draw handler to prevent re-creating on every render
  const handleDrawEvent = useCallback((data: { drawData: any; userId: string }) => {
    console.log('Received draw event:', data);
    if (data.userId !== "some-user-id") {
      const validatedElement = validateAndTransformDrawData(data.drawData);
      if (validatedElement) {
        // Prevent adding groups or invalid Konva nodes
        if (['line', 'rectangle', 'circle', 'text'].includes(validatedElement.type)) {
          addElement(validatedElement);
        } else {
          console.warn('Unsupported element type for rendering:', validatedElement.type);
        }
      } else {
        console.warn('Invalid drawData received:', data.drawData);
      }
    }
  }, [addElement]);

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

      socketService.onDraw(handleDrawEvent);
    }

    return () => {
      if (socketService.socketInstance) {
        socketService.socketInstance.off("element:add");
        socketService.socketInstance.off("element:update");
        socketService.socketInstance.off("presence:update");
      }
      socketService.offDraw();
    };
  }, [boardId, addElement, updateElement, addOrUpdateUser, handleDrawEvent]);

  // Function to validate and transform drawData to CanvasElement
  const validateAndTransformDrawData = (drawData: any): CanvasElement | null => {
    if (!drawData || typeof drawData !== 'object') {
      return null;
    }

    // Required properties for all shapes
    const baseValidation = {
      id: drawData.id || crypto.randomUUID(),
      type: drawData.type,
      x: typeof drawData.x === 'number' ? drawData.x : 0,
      y: typeof drawData.y === 'number' ? drawData.y : 0,
      color: typeof drawData.color === 'string' ? drawData.color : '#000000',
    };

    // Type-specific validation
    switch (drawData.type) {
      case 'line':
        if (!Array.isArray(drawData.points) || drawData.points.length < 4) {
          console.warn('Invalid line: points must be an array with at least 4 elements');
          return null;
        }
        return {
          ...baseValidation,
          type: 'line',
          points: drawData.points.map((p: any) => typeof p === 'number' ? p : 0),
          width: 0,
          height: 0,
          text: '',
        };

      case 'rectangle':
      case 'circle':
        const width = typeof drawData.width === 'number' ? drawData.width : 0;
        const height = typeof drawData.height === 'number' ? drawData.height : 0;
        if (Math.abs(width) <= 0 || Math.abs(height) <= 0) {
          console.warn(`Invalid ${drawData.type}: width and height must be non-zero`);
          return null;
        }
        return {
          ...baseValidation,
          type: drawData.type,
          points: [],
          width: Math.abs(width),
          height: Math.abs(height),
          text: '',
        };

      case 'text':
        if (typeof drawData.text !== 'string') {
          console.warn('Invalid text: text must be a string');
          return null;
        }
        return {
          ...baseValidation,
          type: 'text',
          points: [],
          width: 0,
          height: 0,
          text: drawData.text,
        };

      case 'arrow':
        if (!Array.isArray(drawData.points) || drawData.points.length < 4) {
          console.warn('Invalid arrow: points must be an array with at least 4 elements');
          return null;
        }
        return {
          ...baseValidation,
          type: 'arrow',
          points: drawData.points.map((p: any) => typeof p === 'number' ? p : 0),
          width: 0,
          height: 0,
          text: '',
        };

      default:
        console.warn(`Unsupported shape type: ${drawData.type}`);
        return null;
    }
  };

  const getPointerPosition = (stage: Konva.Stage): Vector2d => {
    const position = stage.getPointerPosition();
    return position ? position as Vector2d : { x: 0, y: 0 };
  }

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPosition(stage);

    if (currentTool === 'eraser') {
      // Hit test to find top node and remove its element from store
      const shape = stage.getIntersection(pos as any);
      const id = shape?.id?.();
      if (id) {
        useBoardStore.getState().removeElement(id);
      }
      return; // Do not start drawing
    }

    if (currentTool === 'fill') {
      // Fill tool: change color of clicked shape
      const shape = stage.getIntersection(pos as any);
      const id = shape?.id?.();
      if (id) {
        const element = elements.find(el => el.id === id);
        if (element) {
          const updatedElement = { ...element, color: currentColor };
          updateElement(updatedElement);
          socketService.sendElementUpdate(boardId, updatedElement);
        }
      }
      return;
    }

    if (currentTool === 'pen') {
      setDrawing(true);
      const elementId = uuidv4();
      currentlyDrawingRef.current = elementId;
      const newElement: CanvasElement = {
        id: elementId,
        type: 'line',
        points: [pos.x, pos.y], // start with first point
        x: 0, y: 0,
        color: currentColor,
        strokeWidth: 5,
      };
      addElement(newElement);
    } else if (currentTool === 'brush') {
      setDrawing(true);
      const elementId = uuidv4();
      currentlyDrawingRef.current = elementId;
      const newElement: CanvasElement = {
        id: elementId,
        type: 'line',
        points: [pos.x, pos.y], // start with first point
        x: 0, y: 0,
        color: currentColor,
        strokeWidth: 10,
      };
      addElement(newElement);
    } else if (currentTool === 'rectangle') {
      setDrawing(true);
      const elementId = uuidv4();
      currentlyDrawingRef.current = elementId;
      const newElement: CanvasElement = {
        id: elementId,
        type: 'rectangle',
        x: pos.x, y: pos.y,
        width: 0, height: 0,
        color: currentColor,
      };
      addElement(newElement);
    } else if (currentTool === 'circle') {
      setDrawing(true);
      const elementId = uuidv4();
      currentlyDrawingRef.current = elementId;
      const newElement: CanvasElement = {
        id: elementId,
        type: 'circle',
        x: pos.x, y: pos.y,
        width: 0, height: 0,
        color: currentColor,
      };
      addElement(newElement);
    } else if (currentTool === 'line' || currentTool === 'arrow') {
      setLineStart(pos);
    } else if (currentTool === 'text') {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'text',
        x: pos.x, y: pos.y,
        text: 'Type something...',
        color: currentColor,
      };
      addElement(newElement);
      // Persist and broadcast text immediately
      useBoardStore.getState().persistDraw(boardId, newElement);
      socketService.sendElementAdd(boardId, newElement);
      socketService.sendDraw(boardId, newElement, "some-user-id");
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
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPosition(stage);

    if (currentTool === 'eraser') {
      // Eraser on drag
      const shape = stage.getIntersection(pos as any);
      const id = shape?.id?.();
      if (id && id !== lastErasedRef.current) {
        useBoardStore.getState().removeElement(id);
        lastErasedRef.current = id;
      }
      return;
    }

    if (!isDrawing || !currentlyDrawingRef.current) return;
    const latestElement = elements[elements.length - 1];

    if (!latestElement || latestElement.id !== currentlyDrawingRef.current) return;

    let updatedElement: CanvasElement | null = null;
    if (currentTool === 'pen') {
      // Only add a point if we moved enough to smooth the line
      const pts = latestElement.points || [];
      const lastX = pts[pts.length - 2] ?? pos.x;
      const lastY = pts[pts.length - 1] ?? pos.y;
      const dx = pos.x - lastX;
      const dy = pos.y - lastY;
      const dist2 = dx * dx + dy * dy;
      const minDist2 = 3 * 3; // threshold in px^2
      const newPoints = dist2 >= minDist2 ? pts.concat([pos.x, pos.y]) : pts;
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
      // Only update local state, no socket traffic here
      setElements(elements.slice(0, elements.length - 1).concat(updatedElement));
    }
  };

  const handleMouseUp = () => {
    if (lineStart) {
      // Create line or arrow
      const stage = stageRef.current;
      if (!stage) return;
      const pos = getPointerPosition(stage);
      const elementId = uuidv4();
      const newElement: CanvasElement = {
        id: elementId,
        type: currentTool === 'arrow' ? 'arrow' : 'line',
        points: [lineStart.x, lineStart.y, pos.x, pos.y],
        x: 0, y: 0,
        color: currentColor,
        strokeWidth: 5,
      };
      addElement(newElement);
      useBoardStore.getState().persistDraw(boardId, newElement);
      socketService.sendElementAdd(boardId, newElement);
      socketService.sendDraw(boardId, newElement, "some-user-id");
      setLineStart(null);
      return;
    }

    if (isDrawing && currentlyDrawingRef.current) {
      setDrawing(false);
      const latestElement = elements[elements.length - 1];
      console.log('Mouse up - latest element:', latestElement);

      if (latestElement && latestElement.type !== 'text' && latestElement.id === currentlyDrawingRef.current) {
        // Only send complete shapes - validate before sending
        if (isShapeComplete(latestElement)) {
          console.log('Sending complete element:', latestElement);
          // Persist to REST API and send realtime events
          useBoardStore.getState().persistDraw(boardId, latestElement);
          socketService.sendElementAdd(boardId, latestElement);
          socketService.sendDraw(boardId, latestElement, "some-user-id");
        } else {
          console.log('Removing incomplete element:', latestElement);
          // Remove incomplete element from local state
          setElements(elements.slice(0, elements.length - 1));
        }
      }

      // Clear the currently drawing reference
      currentlyDrawingRef.current = null;
    }
    // Reset eraser last erased
    lastErasedRef.current = null;
  };

  // Helper function to check if a shape is complete
  const isShapeComplete = (element: CanvasElement): boolean => {
    switch (element.type) {
      case 'line':
        return Array.isArray(element.points) && element.points.length >= 6; // at least 3 points for smoother stroke
      case 'rectangle':
      case 'circle':
        return Math.abs(element.width ?? 0) > 5 && Math.abs(element.height ?? 0) > 5;
      case 'text':
        return true;
      default:
        return false;
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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Toolbar - fixed width on larger screens, collapsible on mobile */}
      <div className="flex-shrink-0">
        <Toolbar />
      </div>
      
      {/* Canvas container - fills remaining space */}
      <div 
        ref={containerRef}
        className="flex-1 min-w-0 min-h-0 relative overflow-hidden"
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <ElementRenderer onElementClick={(e: KonvaEventObject<MouseEvent>) => {
              const node = e.target;
              if ('id' in node) { // Check if node has an id property
                const id = node.id();
                setSelectedElement(id);
                // Check if it's a text element for editing
                const element = elements.find(el => el.id === id);
                if (element && element.type === 'text') {
                  const rect = node.getClientRect();
                  const stageBox = stageRef.current?.container().getBoundingClientRect();
                  if (stageBox) {
                    setEditingTextId(id);
                    setEditingTextValue(element.text || '');
                    setEditingTextPosition({
                      x: stageBox.left + rect.x,
                      y: stageBox.top + rect.y,
                    });
                  }
                }
              }
              e.cancelBubble = true;
            }} onElementDragEnd={onElementDragEnd} />
            <Transformer ref={transformerRef} />
          </Layer>
          <UserPresence />
        </Stage>
        
        {/* Text editing input */}
        {editingTextId && (
          <input
            type="text"
            value={editingTextValue}
            onChange={(e) => setEditingTextValue(e.target.value)}
            onBlur={() => {
              if (editingTextId) {
                const updatedElement = elements.find(el => el.id === editingTextId);
                if (updatedElement) {
                  const newElement = { ...updatedElement, text: editingTextValue };
                  updateElement(newElement);
                  socketService.sendElementUpdate(boardId, newElement);
                }
              }
              setEditingTextId(null);
              setEditingTextValue('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            className="absolute z-[1000] px-2 py-1 text-base border border-gray-300 bg-white rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              left: Math.max(0, Math.min(editingTextPosition.x, dimensions.width - 200)),
              top: Math.max(0, Math.min(editingTextPosition.y, dimensions.height - 40)),
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}