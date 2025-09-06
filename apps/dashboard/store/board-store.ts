import { create } from 'zustand';
import { CanvasElement, ToolType } from '../src/core/types/board.types';
import { 
  getCanvas, 
  updateCanvas, 
  saveCanvas, 
  listBoards, 
  createBoard, 
  deleteBoard, 
  clearCanvas,
  duplicateBoard 
} from '../src/utils/canvasApi';

interface Board {
  _id: string;
  roomId: string;
  name: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  elements: CanvasElement[];
}

interface BoardState {
  // Canvas state
  elements: CanvasElement[];
  currentTool: ToolType;
  currentColor: string;
  selectedElementId: string | null;
  history: CanvasElement[][];
  historyStep: number;
  isDrawing: boolean;
  
  // Board management state
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;

  // Canvas actions
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  setSelectedElement: (id: string | null) => void;
  setDrawing: (isDrawing: boolean) => void;
  updateElement: (updatedElement: CanvasElement) => void;
  removeElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  
  // Board management actions
  loadUserBoards: () => Promise<void>;
  loadBoard: (roomId: string) => Promise<void>;
  saveCurrentBoard: (name?: string) => Promise<void>;
  createNewBoard: (roomId: string, name: string, creator: string) => Promise<Board | null>;
  deleteBoardById: (roomId: string) => Promise<void>;
  clearCurrentBoard: () => Promise<void>;
  duplicateBoardById: (roomId: string, newName: string) => Promise<Board | null>;
  
  // Real-time persistence
  persistDraw: (roomId: string, element: CanvasElement) => Promise<void>;
  
  // Auto-save functionality
  enableAutoSave: (roomId: string, intervalMs?: number) => void;
  disableAutoSave: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => {
  let autoSaveInterval: NodeJS.Timeout | null = null;
  
  return {
    // Initial state
    elements: [],
    currentTool: 'pen',
    currentColor: '#000000',
    selectedElementId: null,
    history: [[]],
    historyStep: 0,
    isDrawing: false,
    boards: [],
    currentBoard: null,
    isLoading: false,
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,

    // Canvas actions
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
        hasUnsavedChanges: true,
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
        elements: get().elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
        hasUnsavedChanges: true,
      });
    },
    removeElement: (id) => {
      const { elements, setElements } = get();
      setElements(elements.filter(el => el.id !== id));
    },
    undo: () => {
      const { history, historyStep } = get();
      if (historyStep > 0) {
        const newStep = historyStep - 1;
        set({
          historyStep: newStep,
          elements: history[newStep],
          selectedElementId: null,
          hasUnsavedChanges: true,
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
          selectedElementId: null,
          hasUnsavedChanges: true,
        });
      }
    },

    // Board management actions
    async loadUserBoards() {
      set({ isLoading: true });
      try {
        const boards = await listBoards();
        set({ boards, isLoading: false });
      } catch (error) {
        console.error('Failed to load user boards:', error);
        set({ isLoading: false });
      }
    },

    async loadBoard(roomId: string) {
      set({ isLoading: true });
      try {
        const canvas = await getCanvas(roomId);
        if (canvas && Array.isArray(canvas.elements)) {
          set({
            elements: canvas.elements,
            history: [canvas.elements],
            historyStep: 0,
            currentBoard: canvas,
            hasUnsavedChanges: false,
            isLoading: false
          });
          // Enable auto-save when board is loaded
          get().enableAutoSave(roomId);
        } else if (canvas === null) {
          console.warn('Canvas data not available for roomId:', roomId);
          set({
            elements: [],
            history: [[]],
            historyStep: 0,
            currentBoard: null,
            hasUnsavedChanges: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Failed to load board:', error);
        set({ isLoading: false });
      }
    },

    async saveCurrentBoard(name?: string) {
      const { elements, currentBoard } = get();
      if (!currentBoard) return;
      
      set({ isSaving: true });
      try {
        const saveData = { 
          elements,
          ...(name && { name })
        };
        
        const updatedBoard = await saveCanvas(currentBoard.roomId, saveData);
        set({ 
          isSaving: false, 
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          currentBoard: updatedBoard 
        });
        
        // Refresh boards list
        get().loadUserBoards();
      } catch (error) {
        console.error('Failed to save board:', error);
        set({ isSaving: false });
      }
    },

    async createNewBoard(roomId: string, name: string, creator: string) {
      set({ isLoading: true });
      try {
        const newBoard = await createBoard({ roomId, name, creator });
        set({ isLoading: false });
        
        // Refresh boards list
        await get().loadUserBoards();
        return newBoard;
      } catch (error) {
        console.error('Failed to create board:', error);
        set({ isLoading: false });
        return null;
      }
    },

    async deleteBoardById(roomId: string) {
      try {
        await deleteBoard(roomId);
        
        // Remove from local state
        const { boards, currentBoard } = get();
        const updatedBoards = boards.filter(board => board.roomId !== roomId);
        
        set({ 
          boards: updatedBoards,
          ...(currentBoard?.roomId === roomId && { 
            currentBoard: null, 
            elements: [], 
            history: [[]],
            historyStep: 0 
          })
        });
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    },

    async clearCurrentBoard() {
      const { currentBoard } = get();
      if (!currentBoard) return;
      
      try {
        await clearCanvas(currentBoard.roomId);
        set({ 
          elements: [], 
          history: [[]],
          historyStep: 0,
          hasUnsavedChanges: false 
        });
      } catch (error) {
        console.error('Failed to clear board:', error);
      }
    },

    async duplicateBoardById(roomId: string, newName: string) {
      try {
        const duplicatedBoard = await duplicateBoard(roomId, newName);
        
        // Refresh boards list
        await get().loadUserBoards();
        return duplicatedBoard;
      } catch (error) {
        console.error('Failed to duplicate board:', error);
        return null;
      }
    },

    // Real-time persistence
    async persistDraw(roomId: string, element) {
      try {
        await updateCanvas(roomId, element);
      } catch (error) {
        console.warn('Failed to persist draw:', error);
      }
    },

    // Auto-save functionality
    enableAutoSave(roomId: string, intervalMs = 30000) { // Default 30 seconds
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
      
      autoSaveInterval = setInterval(() => {
        const { hasUnsavedChanges, isSaving } = get();
        if (hasUnsavedChanges && !isSaving) {
          get().saveCurrentBoard();
        }
      }, intervalMs);
    },

    disableAutoSave() {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
      }
    },
  };
});