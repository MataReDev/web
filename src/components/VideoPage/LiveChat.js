import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";

import { AuthContext } from "../../Auth/authContext";
import ChatMenu from "./ChatMenu";

let socketUrl = "https://iseevision.fr";

if (process.env.REACT_APP_ENVIRONMENT === "localhost") {
  socketUrl = "http://localhost:3001/";
}

function LiveChat({ videoId, socket }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");

  const chatListRef = useRef(null);

  useEffect(() => {
    socket.emit("join video chat", videoId);
    // Listen for new messages from the server for the specific video
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      // Leave the room for the specific video when the component unmounts
      socket.emit("leave video chat", videoId);
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat list whenever the messages state changes
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const handleNewMessageSubmit = (event) => {
    if (draftMessage !== "") {
      event.preventDefault();
      // Send the new message to the server for the specific video
      socket.emit("chat message", {
        videoId: videoId,
        author: user.currentUser.username,
        message: draftMessage,
        timestamp: new Date().toJSON(),
      });
      setDraftMessage("");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-gray-200 border border-solid border-gray-300 shadow-lg p-3 rounded-xl h-96 relative flex flex-col">
      <ChatMenu />
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
      <div className="flex w-auto gap-3 bottom-0">
        <input
          type="text"
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          className="flex p-1 border border-black rounded-lg w-full"
        />
        <button
          type="submit"
          onClick={handleNewMessageSubmit}
          className="flex border border-black p-2 bg-gray-200 rounded-lg w-auto"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

function ConditionalLiveChat({ videoId }) {
  const { user } = useContext(AuthContext);
  if (user.isAuthenticated) {
    const socket = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      extraHeaders: {
        "X-XSRF-TOKEN": localStorage.getItem("xsrfToken"),
      },
    });
    return <LiveChat videoId={videoId} socket={socket} />;
  } else {
    return (
      <div className="bg-gray-100 p-3 rounded-xl h-96 relative flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <p>Veuillez vous connecter pour accéder au chat en direct.</p>
      </div>
    );
  }
}

export default ConditionalLiveChat;
