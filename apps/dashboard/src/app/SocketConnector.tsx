"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

// Socket.IO server URL
const SOCKET_URL = "http://localhost:5000";


export default function SocketConnector() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize client socket; restrict to websocket transport for reliability
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Log connection
    socket.on("connect", () => {
      console.log("[socket] connected", { id: socket.id, url: SOCKET_URL });
    });

    // Log disconnection
    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected", { reason });
    });

    // Cleanup on unmount: disconnect and remove listeners
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
        } finally {
          socketRef.current = null;
        }
      }
    };
  }, []);

  return null;
}