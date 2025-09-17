"use client";

import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Comment } from "../../../types/board.types";
import MessageList from "../../chat/MessageList";
import MessageInput from "../../chat/MessageInput";
import chatSocketService from "../../../../utils/chatSocketService";
import { ChatMessage } from "../../../../types/chat";

// import { useState, useEffect } from "react";
// import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
// import { Comment } from "../../../types/board.types";
// import MessageList from "../../chat/MessageList";
// import MessageInput from "../../chat/MessageInput";
// import chatSocketService from "../../../../utils/chatSocketService";
// import { ChatMessage } from "../../../../types/chat";

export const CommentsPanel = () => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'chat'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Join default chat room on mount
  useEffect(() => {
    const defaultRoomId = "default-board-chat"; // Can be made dynamic based on boardId
    const userId = "some-user-id"; // Should come from auth context
    const username = "User"; // Should come from auth context

    chatSocketService.joinChatRoom(defaultRoomId, userId);

    // Listen for chat messages
    chatSocketService.onChatMessage((message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      chatSocketService.offChatMessage();
      chatSocketService.leaveChatRoom(defaultRoomId, userId);
    };
  }, []);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: "some-unique-id", // Will be a real UUID later
      userId: "some-user-id",
      text: commentInput,
      timestamp: new Date().toISOString(),
      boardId: "some-board-id",
      x: 0, // We'll update this to be contextual later
      y: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentInput("");
    // TODO: Emit a 'comment:add' event to the backend
  };

  const handleSendChatMessage = (message: string) => {
    const chatMessage: ChatMessage = {
      roomId: "default-board-chat",
      userId: "some-user-id",
      username: "User", // Should come from auth context
      message,
      type: "message",
      createdAt: new Date(),
    };

    chatSocketService.sendMessage("default-board-chat", chatMessage);
  };

  return (
    <>
      <button
        className="fixed bottom-20 right-4 p-2 rounded-full bg-blue-600 text-white shadow-lg z-50"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Close chat and comments panel" : "Open chat and comments panel"}
      >
        🖐️
      </button>

      {visible && (
        <aside className="fixed bottom-24 right-4 flex flex-col border bg-white w-80 h-[400px] shadow-lg rounded-md z-50">
          {/* Close button */}
          <div className="flex justify-end p-2 border-b">
            <button
              onClick={() => setVisible(false)}
              aria-label="Close chat and comments panel"
              className="text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex border-b">
            <Button
              variant={activeTab === 'comments' ? 'default' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'comments' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {comments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No comments yet. Share your thoughts!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="rounded-md bg-gray-100 p-3 text-sm">
                        <p className="font-semibold">{comment.userId}</p>
                        <p>{comment.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 border-t p-3">
                  <Input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <Button onClick={handleAddComment}>Send</Button>
                </div>
              </>
            )}

            {activeTab === 'chat' && (
              <>
                <MessageList messages={chatMessages} />
                <MessageInput onSendMessage={handleSendChatMessage} />
              </>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
