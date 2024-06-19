"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as dotenv from "dotenv"

dotenv.config();
const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.log("NEXT_PUBLIC_BACKEND_URL is not defined in the environment.");
}

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextProps {
  registerUser: (name: string) => void;
  sendMessage: (msg: string) => void;
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

  const registerUser: SocketContextProps["registerUser"] = useCallback(
    (name) => {
      if (socket) {
        socket.emit("event:register", { name });
      }
    },
    [socket]
  );

  const sendMessage: SocketContextProps["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message:", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback((data: { name: string, message: string }) => {
    console.log("From Server Message Received", `${data.name}: ${data.message}`);
    setMessages((prev) => [...prev, `${data.name}: ${data.message}`]);
  }, []);

  useEffect(() => {
    const _socket = io(`${BACKEND_URL}`);
    _socket.on("event:message", onMessageReceive);

    setSocket(_socket);
    return () => {
      _socket.off("event:message", onMessageReceive);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, [onMessageReceive]);

  return (
    <SocketContext.Provider value={{ registerUser, sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
