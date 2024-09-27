import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { createData } from "../../services/Api";
import { useSelector } from "react-redux";

const socket = io(import.meta.env.VITE_HOST, {
  secure: true,
  withCredentials: true,
  rejectUnauthorized: false,
});

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [divisionId, setDivisionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk melacak loading
  const endOfMessagesRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getAllChats = async () => {
    try {
      const response = await createData("/chat/all", {
        division_id: divisionId,
      });

      if (Array.isArray(response)) {
        const formattedMessages = response
          .map((chat) => ({
            userId: chat.user_id,
            message: chat.message,
            userImage:
              chat.User?.Employee?.profile_picture || "/default-avatar.png",
            username: chat.User?.username || "Unknown User",
            createdAt: new Date(chat.createdAt).getTime(),
          }))
          .sort((a, b) => a.createdAt - b.createdAt);
        setMessages(formattedMessages);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false); // Set loading ke false setelah selesai mengambil data
    }
  };

  useEffect(() => {
    if (user) {
      setDivisionId(user.Employee.division_id);
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (divisionId) {
      socket.emit("joinDivision", divisionId);
      getAllChats();

      socket.on("receiveMessage", (chat) => {
        const newMessage = {
          userId: chat.user_id,
          message: chat.message,
          userImage: chat.user.profile_picture,
          username: chat.user.username,
          createdAt: new Date(chat.createdAt).getTime(),
        };
        setMessages((prevMessages) =>
          [...prevMessages, newMessage].sort(
            (a, b) => a.createdAt - b.createdAt
          )
        );
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [divisionId]);

  const handleSendMessage = () => {
    if (message.trim() && userId && divisionId) {
      socket.emit("sendMessage", { message, userId, divisionId });
      setMessage("");
    }
  };

  return (
    <div className="w-[360px] sm-375:w-[375px] sm-376:w-full sm-425:w-full sm-360:w-[360px] sm:w-full md:text-base lg:text-lg md:w-full h-[100%] md:min-h-screen relative bg-gray-700 text-white px-4 flex flex-col">
      <div className="mt-8 flex-1 w-full md:w-full overflow-y-auto">
        <div className="grid gap-2">
          {loading ? (
            // Skeleton Design saat loading
            <>
              {[...Array(11)].map((_, index) => (
                <div key={index} className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Tampilkan pesan jika tidak loading
            messages.map((msg, index) => (
              <div
                key={index}
                className="grid grid-cols-[auto_1fr] w-80 md:w-full gap-3 items-start"
              >
                {index === 0 ||
                messages[index - 1].username !== msg.username ? (
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}/${msg.userImage}`}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div>
                    <img
                      src={`https://10.10.101.187:3001/uploads/${msg.userImage}`}
                      alt="User"
                      className="w-10 h-1 rounded-full opacity-0"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  {index === 0 ||
                  messages[index - 1].username !== msg.username ? (
                    <strong
                      className={
                        msg.username === user.username
                          ? "text-blue-500"
                          : "text-green-500"
                      }
                    >
                      {msg.username}{" "}
                    </strong>
                  ) : null}
                  <div className="flex flex-wrap">{msg.message}</div>
                </div>
              </div>
            ))
          )}
          <div ref={endOfMessagesRef}></div>
        </div>
      </div>
      <div className="mt-4 flex sticky pb-2 b bg-gray-700 bottom-0 md:w-full">
        <input
          type="text"
          className="flex-1 bg-gray-600 p-2 rounded"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 ml-2 rounded disabled:opacity-50"
          disabled={!message || loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="w-6 h-6"
          >
            <path
              fill="currentColor"
              d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
