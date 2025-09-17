import { ChatRoom } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Users } from 'lucide-react';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  onRoomClick: (roomId: string) => void;
}

export default function ChatRoomList({ rooms, onRoomClick }: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No chat rooms available. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card
          key={room.roomId}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onRoomClick(room.roomId)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{room.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              Room ID: {room.roomId}
            </div>
            {room.participants && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Users className="w-4 h-4 mr-1" />
                {room.participants} participants
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
