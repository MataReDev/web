import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import makeRequest from "../../Utils/RequestUtils";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../Auth/authContext";
import { toast } from "react-toastify";
import {
  UsersIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";

let socketUrl = "https://iseevision.fr";

if (process.env.REACT_APP_ENVIRONMENT === "localhost") {
  socketUrl = "http://localhost:3001/";
}
function LiveChat({ videoId }) {
  const { user, addToSecureLocalStorage, removeFromSecureLocalStorage } =
    useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();

  const chatListRef = useRef(null);

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  const checkAuthentication = async () => {
    makeRequest("api/users/checkIsAuth", "GET", null, null, null, true)
      .then((data) => {
        if (data !== null) {
          const { user } = data;
          if (user) {
            addToSecureLocalStorage("user", user);
          }
        }
      })
      .catch((error) => {
        removeFromSecureLocalStorage("user");

       // toast.error("An error occurred, please reconnect", toastOptions);
      });
  };
function handlePageUnload() {
  socketRef.current.emit("leave video chat", videoId);
}


useEffect(() => {
  window.addEventListener("beforeunload", handlePageUnload);

  return () => window.removeEventListener("beforeunload", handlePageUnload);
}, [location]);

  useEffect(() => {
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      extraHeaders: {
        "X-XSRF-TOKEN": localStorage.getItem("xsrfToken"),
      },
    });

    const socket = socketRef.current;

    socket.emit("join video chat", videoId, user.currentUser);
    // Listen for new messages from the server for the specific video
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    //Listen for new users joined to the video
    socket.on("user joined", (users) => {
      setConnectedUsers(users);
    });

    //Listen for users leaving the video
    socket.on("user left", (users) => {
      setConnectedUsers(users);
    });

    socket.on("rafraichir-token", () => {
      checkAuthentication();
    });


    return () => {
      socket.emit("leave video chat", videoId);
      socket.off("chat message");
      socket.off("user joined");
      socket.off("user left");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (chatListRef.current?.scrollTop)
      // Scroll to the bottom of the chat list whenever the messages state changes
      chatListRef.current.scrollTop = chatListRef.current?.scrollHeight;
  }, [messages]);

  const handleNewMessageSubmit = (event) => {
    if (draftMessage !== "") {
      const socket = socketRef.current;
      event.preventDefault();
      if (socket.id) {
        // Send the new message to the server for the specific video
        socket.emit("chat message", {
          videoId: videoId,
          author: user.currentUser.username,
          message: draftMessage,
          timestamp: new Date().toJSON(),
        });
        setDraftMessage("");
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return `${hours}:${minutes}`;
  };

  const [Menu, setMenu] = useState(false);

  return (
    <div className="bg-gray-200 border border-solid border-gray-300 shadow-lg p-3 rounded-xl h-96 relative flex flex-col">
      <div className="flex justify-start">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        {!Menu ? (
          <>
            <UsersIcon
              className="h-5 w-5 ml-4 mt-1 text-black cursor-pointer"
              onClick={() => {
                setMenu(!Menu);
              }}
            />
            <span
              className="text-lg ml-[2px] font-semibold text-black cursor-pointer"
              onClick={() => {
                setMenu(!Menu);
              }}
            >
              {connectedUsers.length}
            </span>
          </>
        ) : (
          <ChatBubbleBottomCenterIcon
            className="h-5 w-5 ml-4 mt-1 text-black cursor-pointer"
            onClick={() => {
              setMenu(!Menu);
            }}
          />
        )}
      </div>

      {!Menu ? (
        <>
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
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-4">
          Chat users
          </h2>
          <div className="overflow-y-scroll h-64 mx-3">
            <table className="min-w-full ">
              <tbody>
                {connectedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b border-gray-300 py-2">
                      <img
                        className="rounded-full w-6 h-6"
                        src={user.logo_path}
                        alt={user.username + " Profile Picture "}
                      />
                    </td>
                    <td className="border-b border-gray-300 py-2">
                      {user.username}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ConditionalLiveChat({ videoId }) {
  const { user } = useContext(AuthContext);
  if (user.isAuthenticated) {
    return <LiveChat videoId={videoId} />;
  } else {
    return (
      <div className="bg-gray-100 p-3 rounded-xl h-96 relative flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <p>Please log in to access the live chat.</p>
      </div>
    );
  }
}

export default ConditionalLiveChat;
