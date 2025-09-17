import socketService from './socketService';
import { ChatMessage } from '../../types/chat';

class ChatSocketService {
  joinChatRoom(roomId: string, userId: string) {
    socketService.connect();
    socketService.socketInstance?.emit('joinRoom', { roomId, userId });
  }

  leaveChatRoom(roomId: string, userId: string) {
    socketService.socketInstance?.emit('leaveRoom', { roomId, userId });
  }

  onChatMessage(callback: (message: ChatMessage) => void) {
    socketService.socketInstance?.on('chatMessage', callback);
  }

  offChatMessage() {
    socketService.socketInstance?.off('chatMessage');
  }

  sendMessage(roomId: string, message: ChatMessage) {
    socketService.socketInstance?.emit('chatMessage', message);
  }
}

const chatSocketService = new ChatSocketService();
export default chatSocketService;
