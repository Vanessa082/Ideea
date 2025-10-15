"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { baseStyle, ElementStyle, ShapeStyle, Tool } from '@/core/types/canvas';
import { useRealtimeCanvas, CanvasElement } from '@/core/hook/use-realtime-canvas';

interface CanvasContextType {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  elements: CanvasElement[];
  isSynced: boolean;
  collaborators: any[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  addElement: (element: Omit<CanvasElement, 'id' | 'creatorId' | 'createdAt'>) => void;
  addElementWithStyle: (element: Omit<CanvasElement, 'id' | 'creatorId' | 'createdAt'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  exportCanvas: (format: 'json' | 'svg' | 'png') => void;
  updateCursor: (x: number, y: number) => void;
  defaultStyle: ShapeStyle;
  setDefaultStyle: (style: Partial<ShapeStyle>) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

interface CanvasProviderProps {
  boardId: string;
  children: ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ boardId, children }) => {
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaultStyle, setDefaultStyleState] = useState<ShapeStyle>(baseStyle);

  const setDefaultStyle = (style: Partial<ShapeStyle>) => {
    setDefaultStyleState((prev) => ({ ...prev, ...style }));
  };

  const {
    elements,
    isSynced,
    addElement,
    updateElement,
    deleteElement,
    undo,
    redo,
    exportCanvas,
    collaborators,
    updateCursor,
  } = useRealtimeCanvas(boardId);

  const addElementWithStyle = (element: Omit<CanvasElement, 'id' | 'creatorId' | 'createdAt'>): string => {
    const newEl: Omit<CanvasElement, 'id' | 'creatorId' | 'createdAt'> = {
      ...element,
      style: {
        fill: element.style?.fill ?? defaultStyle.fill,
        stroke: element.style?.stroke ?? defaultStyle.stroke,
        strokeWidth: element.style?.strokeWidth ?? defaultStyle.strokeWidth,
        dash: element.style?.dash ?? defaultStyle.dash,
        fontSize: element.style?.fontSize ?? defaultStyle.fontSize,
        fontFamily: element.style?.fontFamily ?? defaultStyle.fontFamily,
        opacity: element.style?.opacity ?? defaultStyle.opacity ?? 1,
      } as ElementStyle,
    };

    const id = addElement(newEl);
    if (!id) throw new Error("Failed to create element");
    return id;
  };

  const value: CanvasContextType = {
    activeTool,
    setActiveTool,
    elements,
    isSynced,
    collaborators,
    selectedId,
    setSelectedId,
    addElement,
    addElementWithStyle,
    updateElement,
    deleteElement,
    undo,
    redo,
    exportCanvas,
    updateCursor,
    defaultStyle,
    setDefaultStyle,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
};
