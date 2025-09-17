import { ChatMessage } from '@/types/chat';
interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message._id || index} className="flex flex-col">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{message.username}</span>
                    <span className="text-xs text-gray-500">
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">
                    {message.message}
                  </div>
                  {message.type !== 'message' && (
                    <div className="text-xs text-gray-400 mt-1">
                      {message.type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
