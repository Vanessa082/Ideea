
export type Vector2d = {
  x: number;
  y: number;
};

export type ElementType = 'line' | 'rectangle' | 'circle' | 'text';

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
  isDragging?: boolean;
}

export interface BoardEvent {
  boardId: string;
  element: CanvasElement;
}

export type ToolType = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';

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