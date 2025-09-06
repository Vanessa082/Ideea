import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3007');
      this.socket.on('connect', () => {
        console.log('Connected to socket server');
      });
      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinBoard(boardId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', { roomId: boardId, userId });
    }
  }

  leaveBoard(boardId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('leaveRoom', { roomId: boardId, userId });
    }
  }

  sendDraw(boardId: string, drawData: any, userId: string) {
    console.log('🚨 SENDING DRAW EVENT:', {
      boardId,
      drawData: {
        type: drawData.type,
        id: drawData.id,
        pointsLength: drawData.points?.length,
        width: drawData.width,
        height: drawData.height
      },
      userId,
      stack: new Error().stack // This will show you exactly where sendDraw is being called from
    });
    
    if (this.socket) {
      this.socket.emit('draw', { roomId: boardId, drawData, userId });
    }
  }

  onDraw(callback: (data: { drawData: any; userId: string }) => void) {
    if (this.socket) {
      this.socket.on('draw', callback);
    }
  }

  offDraw() {
    if (this.socket) {
      this.socket.off('draw');
    }
  }

  sendElementAdd(boardId: string, element: any) {
    console.log('📝 SENDING ELEMENT ADD:', element.type, element.id);
    if (this.socket) {
      this.socket.emit('element:add', { boardId, element });
    }
  }

  sendElementUpdate(boardId: string, element: any) {
    console.log('✏️ SENDING ELEMENT UPDATE:', element.type, element.id);
    if (this.socket) {
      this.socket.emit('element:update', { boardId, element });
    }
  }

  get socketInstance() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;