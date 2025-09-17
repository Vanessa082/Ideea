"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatRoom } from '@/types/chat';
import { chatApi } from '@/lib/chatApi';
import ChatRoomView from '@/core/components/chat/ChatRoomView';

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        const roomData = await chatApi.getChatRoom(roomId);
        setRoom(roomData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

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

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Chat room not found</div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Invalid room ID</div>
      </div>
    );
  }

  return <ChatRoomView roomId={roomId} room={room} />;
}
