"use client";

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
// CORRECTION: Import Awareness tools from y-protocols/awareness
import * as awarenessProtocol from 'y-protocols/awareness';
import { toast } from 'sonner';
import { useAuth } from './auth-context';
import { CanvasElement } from '../types/canvas';
import { v4 as uuidv4 } from 'uuid';

// Global Yjs instances (managed outside the hook to ensure singletons)
const AWARENESS_DOC = new Y.Doc();
const Y_AWARENESS = new awarenessProtocol.Awareness(AWARENESS_DOC);

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:4000';

// Global state variables for Yjs objects
let boardSocket: Socket | null = null;
let ydoc: Y.Doc | null = null;
let elementsMap: Y.Map<CanvasElement> | null = null;
let undoManager: Y.UndoManager | null = null;

export type { CanvasElement } from '../types/canvas';

export const useRealtimeCanvas = (boardId: string) => {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [isSynced, setIsSynced] = useState(true);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);

  // --- Initialization & Connection ---
  useEffect(() => {
    // 1. Exit if the client is not ready
    if (!isAuthenticated || !accessToken || !boardId || !user) {
      if (boardSocket) boardSocket.disconnect();
      ydoc = null;
      return;
    }

    if (ydoc) return; // Already initialized

    // 2. Initialize Yjs Document & Map
    ydoc = new Y.Doc();
    elementsMap = ydoc.getMap<CanvasElement>('canvasElements');
    undoManager = new Y.UndoManager(elementsMap);

    // 3. Initialize Socket.IO connection
    // NOTE: Client connects to REALTIME_URL/board
    boardSocket = io(`${REALTIME_URL}/board`, {
      auth: { token: accessToken, user: user },
      transports: ['websocket'],
    });

    // 4. Handle Socket Events
    boardSocket.on('connect', () => {
      console.log(`Board Socket Connected. Joining room: ${boardId}`);
      // Client explicitly joins the room after successful socket connection
      boardSocket?.emit('joinBoard', { boardId });
    });

    boardSocket.on('disconnect', () => {
      console.log('Board Socket Disconnected');
      setIsSynced(false);
    });

    boardSocket.on('boardJoined', () => {
      // Optional: use this event to confirm successful room join
      console.log(`Successfully joined board room: ${boardId}`);
    });


    // Server sends the full current state (snapshot) on join
    boardSocket.on('init-state', (stateBase64: string) => {
      console.log('Received initial state from gateway.');
      const updateBinary = new Uint8Array(Buffer.from(stateBase64, 'base64'));
      Y.applyUpdate(ydoc!, updateBinary, boardSocket);
      setIsSynced(true);
      Y_AWARENESS.setLocalStateField('cursor', null);
    });

    // Server relays updates from other users
    boardSocket.on('yjsUpdate', (updateBase64: string) => {
      const updateBinary = new Uint8Array(Buffer.from(updateBase64, 'base64'));
      Y.applyUpdate(ydoc!, updateBinary, boardSocket);
    });

    // Server relays awareness updates from other users
    boardSocket.on('awarenessUpdate', (updateBase64: string) => {
      const updateBinary = new Uint8Array(Buffer.from(updateBase64, 'base64'));
      awarenessProtocol.applyAwarenessUpdate(Y_AWARENESS, updateBinary, boardSocket);
    });

    boardSocket.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
      toast.error(`Realtime connection failed. Error: ${err.message}`);
      setIsSynced(false);
    });


    // 5. Handle Yjs Document Updates (for persisting and broadcasting)
    const yDocObserver = (updateBinary: Uint8Array, origin: unknown) => {
      // Only send updates that originated locally
      if (origin !== boardSocket) {
        const updateBase64 = Buffer.from(updateBinary).toString('base64');
        // FIX: The payload now matches the gateway expectation
        boardSocket?.emit('yjsUpdate', { boardId, update: updateBase64 });
      }
    };
    ydoc.on('update', yDocObserver);


    // 6. Handle Yjs Awareness Updates
    const yAwarenessObserver = ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }, origin: unknown) => {
      // Only send updates that originated locally
      if (origin !== boardSocket) {
        const awarenessUpdateBinary = awarenessProtocol.encodeAwarenessUpdate(Y_AWARENESS, Array.from(new Set([...added, ...updated, ...removed])));
        const updateBase64 = Buffer.from(awarenessUpdateBinary).toString('base64');
        // FIX: The payload now matches the gateway expectation
        boardSocket?.emit('awarenessUpdate', { boardId, update: updateBase64 });
      }

      // Update local React state for rendering cursors
      const newCollaborators: any[] = [];
      Y_AWARENESS.getStates().forEach((state: any, clientId: number) => {
        if (state.userId && state.userId !== user.id) {
          newCollaborators.push({ ...state, clientId });
        }
      });
      setCollaborators(newCollaborators);
    };
    Y_AWARENESS.on('update', yAwarenessObserver);

    // Initialize Local Awareness State
    Y_AWARENESS.setLocalState({
      userId: user.id,
      username: user.username,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      cursor: null as { x: number, y: number } | null,
    });


    // 7. Handle Map Changes (State synchronization for React)
    const mapObserver = () => {
      const newElements: CanvasElement[] = Array.from(elementsMap!.values());
      setElements(newElements);
    };
    elementsMap.observe(mapObserver);

    // Initial sync of the map to React state
    mapObserver();


    // 8. Cleanup
    return () => {
      ydoc?.off('update', yDocObserver);
      Y_AWARENESS.off('update', yAwarenessObserver);
      elementsMap?.unobserve(mapObserver);
      boardSocket?.disconnect();
      ydoc = null;
      elementsMap = null;
      undoManager = null;
    };
  }, [isAuthenticated, accessToken, boardId, user]);


  // 💥 FIX 3: Ensure all CanvasElement properties are correctly initialized/defaulted
  const addElement = useCallback((element: Omit<CanvasElement, 'id' | 'creatorId' | 'createdAt'>): string | void => {
    let newId: string | undefined;

    ydoc?.transact(() => {
      newId = uuidv4();
      const newElement: CanvasElement = {
        // Required properties from the base element
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        type: element.type,
        style: element.style,

        // Optional/Specific properties, ensuring defaults if the tool requires them
        data: element.data || '',
        points: element.points || [],

        id: newId,
        creatorId: user?.id || 'anonymous',
        createdAt: Date.now(),
      };
      elementsMap?.set(newId, newElement);
    }, boardSocket);

    return newId;
  }, [user]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    ydoc?.transact(() => {
      const current = elementsMap?.get(id);
      if (current) {
        elementsMap?.set(id, { ...current, ...updates });
      }
    }, boardSocket);
  }, []);

  const deleteElement = useCallback((id: string) => {
    ydoc?.transact(() => {
      elementsMap?.delete(id);
    }, boardSocket);
  }, []);

  const undo = useCallback(() => {
    if (undoManager?.undoStack.length === 0) {
      toast.info('Nothing left to undo.');
      return;
    }
    undoManager?.undo();
  }, []);

  const redo = useCallback(() => {
    if (undoManager?.redoStack.length === 0) {
      toast.info('Nothing left to redo.');
      return;
    }
    undoManager?.redo();
  }, []);

  // --- Utility Actions ---

  const exportCanvas = useCallback((format: 'json' | 'svg' | 'png') => {
    if (format === 'json') {
      const data = JSON.stringify(elements, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardId}-canvas-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Canvas exported as JSON!');
    } else {
      toast.info(`Triggering ${format.toUpperCase()} export...`);
    }
  }, [elements, boardId]);

  return {
    elements,
    collaborators,
    isSynced,
    addElement,
    updateElement,
    deleteElement,
    undo,
    redo,
    exportCanvas,
    // updateCursor is the awareness function
    updateCursor: useCallback((x: number, y: number) => {
      Y_AWARENESS.setLocalStateField('cursor', { x, y });
    }, [])
  };
};