import { useEffect, useState } from 'react';
import { ChatRoom, ChatMessage } from '@/types/chat';
import { chatApi } from '@/lib/chatApi';
import chatSocketService from '@/utils/chatSocketService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '@/core/hook/auth-context';

interface ChatRoomViewProps {
  roomId: string;
  room: ChatRoom | null;
}

export default function ChatRoomView({ roomId, room }: ChatRoomViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await chatApi.getMessages(roomId);
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join socket room
    if (user?.id) {
      chatSocketService.joinChatRoom(roomId, user.id);
    }

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    };

    chatSocketService.onChatMessage(handleNewMessage);

    return () => {
      // Cleanup
      if (user?.id) {
        chatSocketService.leaveChatRoom(roomId, user.id);
      }
      chatSocketService.offChatMessage();
    };
  }, [roomId, user?.id]);

  const handleSendMessage = async (messageText: string) => {
    if (!user) return;

    const result = await chatApi.sendMessage(roomId, { message: messageText });
    if ('error' in result) {
      setError(result.error);
    } else {
      // Message will be added via socket
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{room?.name || `Room ${roomId}`}</h2>
        <p className="text-sm text-gray-600">Room ID: {roomId}</p>
      </div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
