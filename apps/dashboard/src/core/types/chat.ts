export interface ChatRoom {
  _id?: string;
  roomId: string;
  name: string;
  creator: string;
  participants?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  _id?: string;
  roomId: string;
  userId: string;
  username: string;
  message: string;
  type: 'message' | 'system' | 'join' | 'leave';
  createdAt?: Date;
}

export interface CreateRoomData {
  roomId: string;
  name: string;
}

export interface SendMessageData {
  message: string;
  type?: 'message' | 'system' | 'join' | 'leave';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
