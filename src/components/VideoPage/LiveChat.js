import React, { useState, useEffect } from "react";
import io from "socket.io-client";

function LiveChat({ videoId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("http://localhost:3000");

  useEffect(() => {
    // Join the room for the specific video
    socket.emit("join video", videoId);

    // Listen for new messages from the server for the specific video
    socket.on("new message", (message) => {
      setMessages([...messages, message]);
    });

    // Send an API request to get all messages for the specific video since the user joined
    fetch(`/api/messages?videoId=${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });

    return () => {
      // Leave the room for the specific video when the component unmounts
      socket.emit("leave video", videoId);
    };
  }, []);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageSubmit = (event) => {
    event.preventDefault();
    console.log(newMessage, videoId);
    // Send the new message to the server for the specific video
    socket.emit("new message", newMessage, videoId);
    setNewMessage("");
  };

  return (
    <div className="border border-black p-3 rounded-xl h-96 relative flex flex-col">
      <h2 className="mb-5">Chat</h2>
      <ul className="overflow-auto flex-1">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form
        onSubmit={handleNewMessageSubmit}
        className="flex w-auto gap-3 bottom-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleNewMessageChange} 
          className="flex border border-black rounded-lg w-5/5
          "
        />
        <button
          type="submit"
          className="flex border border-black p-2 bg-gray-200 rounded-lg w-auto"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default LiveChat;
