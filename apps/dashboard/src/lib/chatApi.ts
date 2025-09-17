import { ChatRoom, ChatMessage, CreateRoomData, SendMessageData } from '../../types/chat';

const API_BASE_URL = 'http://localhost:4002';
const CHAT_BASE_URL = `${API_BASE_URL}/chat`;

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const chatApi = {
  // GET /chat - list chat rooms
  async listChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch(CHAT_BASE_URL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat rooms');
    }
    return response.json();
  },

  // GET /chat/:roomId - get messages
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  },

  // GET /chat/:roomId/room - get chat room
  async getChatRoom(roomId: string): Promise<ChatRoom | null> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}/room`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat room');
    }
    return response.json();
  },

  // POST /chat/create - create chat room
  async createChatRoom(data: CreateRoomData): Promise<ChatRoom | { error: string }> {
    const response = await fetch(`${CHAT_BASE_URL}/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || 'Failed to create chat room' };
    }
    return result;
  },

  // POST /chat/:roomId/message - send message
  async sendMessage(roomId: string, data: SendMessageData): Promise<ChatMessage | { error: string }> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || 'Failed to send message' };
    }
    return result;
  },

  // DELETE /chat/:roomId - delete chat room
  async deleteChatRoom(roomId: string): Promise<{ message: string }> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete chat room');
    }
    return response.json();
  },

  // DELETE /chat/:roomId/clear - clear chat
  async clearChat(roomId: string): Promise<{ message: string }> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to clear chat');
    }
    return response.json();
  },

  // POST /chat/:roomId/participants - update participant count
  async updateParticipantCount(roomId: string, count: number): Promise<{ message: string }> {
    const response = await fetch(`${CHAT_BASE_URL}/${roomId}/participants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ count }),
    });
    if (!response.ok) {
      throw new Error('Failed to update participant count');
    }
    return response.json();
  },
};
