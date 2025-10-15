import { create } from "zustand";
import { produce } from "immer";
import { CanvasState } from "@/core/types/canvas";

export const useCanvasStore = create<CanvasState>((set, get) => ({
  activeTool: "pointer",
  shapes: [],
  selectedId: null,
  undoStack: [],
  redoStack: [],

  setTool: (tool) => set({ activeTool: tool }),

  addShape: (shape) =>
    set(produce((state: CanvasState) => {
      state.undoStack.push([...state.shapes]);
      state.redoStack = [];
      state.shapes.push(shape);
    })),

  updateShape: (id, updates) =>
    set(produce((state: CanvasState) => {
      const shape = state.shapes.find((s) => s.id === id);
      if (shape) Object.assign(shape, updates);
    })),

  selectShape: (id) => set({ selectedId: id }),

  deleteShape: (id) =>
    set(produce((state: CanvasState) => {
      state.undoStack.push([...state.shapes]);
      state.redoStack = [];
      state.shapes = state.shapes.filter((s) => s.id !== id);
    })),

  undo: () =>
    set(produce((state: CanvasState) => {
      if (state.undoStack.length > 0) {
        const prev = state.undoStack.pop()!;
        state.redoStack.push([...state.shapes]);
        state.shapes = prev;
      }
    })),

  redo: () =>
    set(produce((state: CanvasState) => {
      if (state.redoStack.length > 0) {
        const next = state.redoStack.pop()!;
        state.undoStack.push([...state.shapes]);
        state.shapes = next;
      }
    })),
}));
