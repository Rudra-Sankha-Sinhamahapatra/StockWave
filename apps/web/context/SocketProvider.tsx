"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextProps {
  sendMessage: (msg: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<SocketContextProps | null>(null);

// Custom hook
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error(`State is Undefined`);
  }
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: SocketContextProps["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message:", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback((data: { message: string }) => {
    console.log("From Server Message Received", data.message);
    setMessages((prev) => [...prev, data.message]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("event:message", onMessageReceive);

    setSocket(_socket);
    return () => {
      _socket.off("event:message", onMessageReceive);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, [onMessageReceive]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
