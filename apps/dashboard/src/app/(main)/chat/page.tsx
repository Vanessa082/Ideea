"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatRoom } from '../../../types/chat';
import { chatApi } from '../../../lib/chatApi';
import { Button } from '@/core/components/ui/button';
import { Plus } from 'lucide-react';
import ChatRoomList from '@/core/components/chat/ChatRoomList';
import CreateRoomModal from '@/core/components/chat/CreateRoomModal';

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await chatApi.listChatRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (data: { roomId: string; name: string }) => {
    const result = await chatApi.createChatRoom(data);
    if ('error' in result) {
      setError(result.error);
    } else {
      setShowCreateModal(false);
      fetchRooms(); // Refresh the list
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
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat Rooms</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Room
        </Button>
      </div>

      <ChatRoomList rooms={rooms} onRoomClick={(roomId) => router.push(`/chat/${roomId}`)} />

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  );
}
