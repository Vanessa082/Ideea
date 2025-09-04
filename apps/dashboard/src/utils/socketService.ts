
import { io, Socket } from 'socket.io-client';

interface UserJoinedData {
  userId: string;
}

interface UserLeftData {
  userId: string;
}

interface MessageData {
  roomId?: string;
  message?: string;
  userId?: string;
  [key: string]: any;
}

interface DrawData {
  roomId: string;
  drawData: any;
  userId: string;
}

interface BrainstormData {
  roomId: string;
  brainstormData: any;
  userId: string;
}

// Socket connection utility
class SocketService {
  private socket: Socket | null = null;
  public isConnected: boolean = false;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:3000', {
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

    // Listen for brainstorm events
    this.socket.on('userJoined', (data: UserJoinedData) => {
      console.log('User joined:', data.userId);
    });

    this.socket.on('userLeft', (data: UserLeftData) => {
      console.log('User left:', data.userId);
    });

    this.socket.on('message', (data: MessageData) => {
      console.log('New message:', data);
    });

    this.socket.on('draw', (data: DrawData) => {
      console.log('Draw event:', data);
    });

    this.socket.on('brainstormUpdated', (data: BrainstormData) => {
      console.log('Brainstorm updated:', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Room management
  joinRoom(roomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', { roomId, userId });
    }
  }

  leaveRoom(roomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('leaveRoom', { roomId, userId });
    }
  }

  // Chat functionality
  sendMessage(roomId: string, message: string, userId: string) {
    if (this.socket) {
      this.socket.emit('sendMessage', { roomId, message, userId });
    }
  }

  // Drawing functionality
  sendDrawData(roomId: string, drawData: any, userId: string) {
    if (this.socket) {
      this.socket.emit('draw', { roomId, drawData, userId });
    }
  }

  // Brainstorm updates
  updateBrainstorm(roomId: string, brainstormData: any, userId: string) {
    if (this.socket) {
      this.socket.emit('updateBrainstorm', { roomId, brainstormData, userId });
    }
  }

  // General message
  sendGeneralMessage(data: any) {
    if (this.socket) {
      this.socket.emit('message', data);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
