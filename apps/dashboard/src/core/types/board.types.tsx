
export type Vector2d = {
  x: number;
  y: number;
};

export type ElementType = 'line' | 'rectangle' | 'circle' | 'text' | 'arrow';

export interface CanvasElement {
  id: string;
  type: ElementType;
  points?: number[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  text?: string;
  strokeWidth?: number;
  isDragging?: boolean;
}

export interface BoardEvent {
  boardId: string;
  element: CanvasElement;
}

export type ToolType = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'brush' | 'arrow' | 'line' | 'fill';

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  boardId: string;
  x: number;
  y: number;
}