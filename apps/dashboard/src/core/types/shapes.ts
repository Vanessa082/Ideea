export type ShapeType =
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "arrow"
  | "text"
  | "sticky"
  | "freehand"
  | "highlighter"
  | "image"
  | "embed"
  | "connector";

export interface Shape {
  id: string;
  type: ShapeType;
  props: Record<string, unknown>;
}
