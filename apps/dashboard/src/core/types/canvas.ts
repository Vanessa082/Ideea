export type Tool =
  | 'pointer'
  | 'pan'
  | 'undo'
  | 'redo'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'text'
  | 'sticky'
  | 'freehand' // Correctly included
  | 'highlighter' // Correctly included
  | 'embed'
  | 'comment'
  | 'emoji'
  | 'template'
  | 'style'
  | 'delete'
  | 'eraser'
  | 'image'
  | 'export';


export type ShapeType =
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'text'
  | 'line'
  | 'arrow'
  | 'sticky'
  | 'freehand'
  | 'highlighter' // Added highlighter
  | 'image'; // Retained 'image' as it was in the old type, though not fully implemented

export interface ShapeStyle {
  stroke: string;
  fill: string;
  strokeWidth: number;
  dash: number[];
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
}

export interface ElementStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  dash: number[];
  opacity: number;
  fontSize: number;
  fontFamily: string;
}

export const baseStyle: ElementStyle = {
  stroke: "#000000",
  fill: "#ffffff",
  strokeWidth: 2,
  dash: [],
  opacity: 1,
  fontSize: 16,
  fontFamily: "Arial",
};

export interface CanvasElement {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  data?: string;
  points?: number[];
  style: ElementStyle;
  creatorId: string;
  createdAt: number;
}

export interface ToolbarProps {
  onSelectTool: (tool: Tool) => void;
  activeTool: Tool;
}