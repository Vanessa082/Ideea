import { create } from 'zustand';
import { CanvasElement, ToolType } from '../src/core/types/board.types';

interface BoardState {
  elements: CanvasElement[];
  currentTool: ToolType;
  currentColor: string;
  selectedElementId: string | null;
  history: CanvasElement[][];
  historyStep: number;
  isDrawing: boolean;

  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  setSelectedElement: (id: string | null) => void;
  setDrawing: (isDrawing: boolean) => void;
  updateElement: (updatedElement: CanvasElement) => void;
  removeElement: (id: string) => void;
  // Remote persistence helpers
  loadBoard: (roomId: string) => Promise<void>;
  persistDraw: (roomId: string, element: CanvasElement) => Promise<void>;
  undo: () => void;
  redo: () => void;
}

import { getCanvas, updateCanvas } from '../src/utils/canvasApi';

export const useBoardStore = create<BoardState>((set, get) => ({
  elements: [],
  currentTool: 'pen',
  currentColor: '#000000',
  selectedElementId: null,
  history: [[]],
  historyStep: 0,
  isDrawing: false,

  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  setElements: (elements) => {
    const { history, historyStep } = get();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(elements);
    set({
      elements,
      history: newHistory,
      historyStep: historyStep + 1,
    });
  },
  addElement: (element) => {
    const { elements, setElements } = get();
    setElements([...elements, element]);
  },
  setSelectedElement: (id) => set({ selectedElementId: id }),
  setDrawing: (isDrawing) => set({ isDrawing }),
  updateElement: (updatedElement) => {
    set({
      elements: get().elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    });
  },
  removeElement: (id) => {
    const { elements, setElements } = get();
    setElements(elements.filter(el => el.id !== id));
  },
  async loadBoard(roomId: string) {
    try {
      const canvas = await getCanvas(roomId);
      // Expecting canvas.elements to be the array of CanvasElement
      if (canvas && Array.isArray(canvas.elements)) {
        set({ elements: canvas.elements, history: [canvas.elements], historyStep: 0 });
      }
    } catch (e) {
      console.warn('Failed to load board', e);
    }
  },
  async persistDraw(roomId: string, element) {
    try {
      await updateCanvas(roomId, element);
    } catch (e) {
      console.warn('Failed to persist draw', e);
    }
  },
  undo: () => {
    const { history, historyStep } = get();
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      set({
        historyStep: newStep,
        elements: history[newStep],
        selectedElementId: null
      });
    }
  },
  redo: () => {
    const { history, historyStep } = get();
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      set({
        historyStep: newStep,
        elements: history[newStep],
        selectedElementId: null
      });
    }
  },
}));