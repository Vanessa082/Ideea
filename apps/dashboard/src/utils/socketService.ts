import { io, Socket } from 'socket.io-client';
import { BoardEvent, UserPresence, CanvasElement } from '../core/types/board.types';

// Define event payloads for type safety
interface JoinBoardPayload {
  boardId: string;
  userId: string;
}

interface PresenceUpdatePayload {
  boardId: string;
  user: UserPresence;
}

class SocketService {
  private socket: Socket | null = null;
  public isConnected: boolean = false;

  /**
   * Establishes a WebSocket connection to the server.
   * This method ensures a connection is only made once.
   */
  public connect() {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });
  }

  /**
   * Disconnects from the WebSocket server.
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Emits a 'join-board' event to the server to join a specific room.
   */
  public joinBoard(boardId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('join-board', { boardId, userId } as JoinBoardPayload);
    }
  }

  /**
   * Emits an 'element:add' event to the server.
   */
  public sendElementAdd(boardId: string, element: CanvasElement) {
    if (this.socket) {
      this.socket.emit('element:add', { boardId, element } as BoardEvent);
    }
  }

  /**
   * Emits an 'element:update' event to the server.
   */
  public sendElementUpdate(boardId: string, element: CanvasElement) {
    if (this.socket) {
      this.socket.emit('element:update', { boardId, element } as BoardEvent);
    }
  }

  /**
   * Emits a 'presence:update' event to the server.
   */
  public sendPresenceUpdate(boardId: string, user: UserPresence) {
    if (this.socket) {
      this.socket.emit('presence:update', { boardId, user } as PresenceUpdatePayload);
    }
  }

  /**
   * Provides access to the underlying Socket.IO instance for event listening.
   */
  public get socketInstance(): Socket | null {
    return this.socket;
  }
}

// Export a singleton instance of the service
const socketService = new SocketService();
export default socketService;