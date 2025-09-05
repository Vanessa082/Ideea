"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Comment } from "../../../types/board.types";

export const CommentsPanel = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  const handleAddComment = () => {
    if (!input.trim()) return;

    const newComment: Comment = {
      id: "some-unique-id", // Will be a real UUID later
      userId: "some-user-id",
      text: input,
      timestamp: new Date().toISOString(),
      boardId: "some-board-id",
      x: 0, // We'll update this to be contextual later
      y: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setInput("");
    // TODO: Emit a 'comment:add' event to the backend
  };

  return (
    <aside className="flex flex-col border-l bg-white">
      <div className="border-b p-3">
        <h3 className="font-semibold">Comments</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-gray-100 p-2 text-sm">
            <p className="font-semibold">{comment.userId}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleAddComment}>Send</Button>
      </div>
    </aside>
  );
};