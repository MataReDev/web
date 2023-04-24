import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import { fakeMessage } from "./fakeMessage";

function LiveChat({ videoId }) {
  const [messages, setMessages] = useState(fakeMessage);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("https://iseevision.fr", {
    path: "/socket.io"
  });
  const chatListRef = useRef(null);

  useEffect(() => {
    console.log("New message", messages.length);
    // Join the room for the specific video
    socket.emit("join video chat", videoId);

    // Listen for new messages from the server for the specific video
    socket.on("chat message", (message) => {
      setMessages([...messages, message]);
    });

    // Send an API request to get all messages for the specific video since the user joined
    //   fetch(`/api/messages?videoId=${videoId}`)
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    //   return response.json();
    // })
    // .then((data) => {
    //   setMessages(data);
    // })
    // .catch((error) => {
    //   console.error("Error fetching messages:", error);
    // });

    return () => {
      // Leave the room for the specific video when the component unmounts
      //socket.emit("leave video chat", videoId);
      //socket.off("chat message");
    };
  }, [videoId, socket]);

  useEffect(() => {
    // Scroll to the bottom of the chat list whenever the messages state changes
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageSubmit = (event) => {
    event.preventDefault();
    console.log(newMessage, videoId);
    // Send the new message to the server for the specific video
    socket.emit("chat message", {
      videoId: videoId,
      author: "test",
      message: newMessage,
      timestamp: new Date().toJSON(),
    });
    setNewMessage("");
  };

  const formatTimestamp = (timestamp) => {
    console.log("timestamp", timestamp);
    const date = new Date(timestamp);
    const hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-gray-100 p-3 rounded-xl h-96 relative flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <ul className="overflow-auto flex-1" ref={chatListRef}>
        {messages.map((message, index) => (
          <li key={index}>
            <p>
              {formatTimestamp(message.timestamp)} {message.author} :{" "}
              {message.content}{" "}
            </p>
          </li>
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
          className="flex border border-black rounded-lg w-5/5"
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
