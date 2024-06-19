"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { registerUser, sendMessage, messages } = useSocket();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [serverMsg, setServerMsg] = useState("Welcome from Server");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (name.trim() === "") {
      setError("Please enter at least one letter.");
      return;
    }
    setError("");
    registerUser(name);
    setIsRegistered(true);
  };

  console.log(messages);
  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-800">
      <h1 className="flex justify-center text-white font-bold mt-4">Texon Chat</h1>
      {!isRegistered ? (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500">
         <div className="border border-white p-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
           <h1 className="text-3xl font-bold mb-4">Enter Your Name</h1>
           <input
             type="text"
             className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="John Doe"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
            {error && <p className="text-red-500 mt-2">{error}</p>}
           <button
             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
             onClick={handleRegister}
           >
             Register
           </button>
         </div>
       </div>
      ) : (
        <>
          <div className="flex-grow ml-20">
            <h1 className="text-blue-300 font-bold mt-4">Messages:</h1>
            <h2 className="text-white font-bold">Server: {serverMsg} <span className="text-blue-400">{name}</span></h2>
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
