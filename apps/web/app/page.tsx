"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { registerUser, sendMessage, messages } = useSocket();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [serverMsg, setServerMsg] = useState("Welcome from Server");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    registerUser(name);
    setIsRegistered(true);
  };

  console.log(messages);
  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-800">
      <h1 className="flex justify-center text-white font-bold mt-4">Texon Chat</h1>
      {!isRegistered ? (
        <div className="flex flex-col items-center mt-4">
          <input
            className="p-2 w-full max-w-screen-lg"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleRegister}
            className="mt-3 outline-none bg-blue-400 text-white font-semibold w-fit px-5 py-2"
          >
            Register
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow ml-20">
            <h1 className="text-blue-300 font-bold mt-4">Messages:</h1>
            <h2 className="text-white font-bold">Server: {serverMsg}</h2>
            <ul className="text-white font-semibold">
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center mb-4 w-full px-5">
            <input
              className="p-2 w-full max-w-screen-lg"
              type="text"
              placeholder="Type your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={() => {
                sendMessage(message);
                setMessage("");
              }}
              className="mt-3 outline-none bg-blue-400 text-white font-semibold w-fit px-5 py-2"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
