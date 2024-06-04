import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  sendMessage,
  markMessageAsRead,
  editMessage,
  deleteMessage,
} from "../../redux/store/chattingSlice";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function ChatWindow({ conversation, currentUser }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chatting.conversations);
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      dispatch(fetchConversations(conversation._id));
      socket.emit("joinRoom", conversation._id);
    }
  }, [conversation, dispatch]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.readBy && !msg.readBy.includes(currentUser.id)) {
        dispatch(markMessageAsRead(msg._id));
      }
    });
  }, [messages, currentUser.id, dispatch]);

  useEffect(() => {
    socket.on("message:newMessage", (newMessage) => {
      if (
        newMessage.receiver === currentUser.id ||
        newMessage.sender === currentUser.id
      ) {
        dispatch(fetchConversations(conversation._id));
      }
    });

    socket.on("messageEdited", (editedMessage) => {
      dispatch(editMessage.fulfilled(editedMessage));
    });

    return () => {
      socket.off("message:newMessage");
      socket.off("messageEdited");
    };
  }, [dispatch, conversation, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messageContainerRef.current &&
        !messageContainerRef.current.contains(event.target)
      ) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [messageContainerRef]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        receiverId: conversation._id,
        content: message,
        senderId: currentUser.id,
        chatId: conversation._id,
      };
      socket.emit("message:sendMessage", newMessage);
      dispatch(sendMessage({ receiverId: conversation._id, content: message }));
      setMessage("");
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }
    setIsEmojiPickerOpen(false);
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(selectedMessage === message._id ? null : message._id);
  };

  const handleEditMessage = (message) => {
    const newContent = prompt("Edit your message:", message.content);
    if (newContent) {
      dispatch(editMessage({ messageId: message._id, content: newContent }));
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteMessage(messageId));
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        Please select a chat
      </div>
    );
  }

  const filteredMessages =
    messages?.filter((msg) =>
      msg?.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const chattingUser =
    conversation.participants?.find((user) => user._id !== currentUser.id) ||
    {};

  return (
    <div className="w-3/4 flex flex-col h-full">
      {/* Top Bar */}
      <div className="border-gray-300 flex items-center justify-between">
        <span className="text-xl font-bold">
          {chattingUser?.personalDetails?.firstName}{" "}
          {chattingUser?.personalDetails?.lastName}
        </span>
      </div>

      <div
        className="flex-grow p-4 overflow-y-scroll"
        ref={messageContainerRef}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url("https://i0.wp.com/www.eastmojo.com/wp-content/uploads/2020/11/64241931_1334991056667259_7650805233559273472_o.jpg?fit=960%2C540&ssl=1")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Search messages"
          />
        </div>

        {/* Messages */}
        {filteredMessages.length ? (
          filteredMessages.map((msg, index) => {
            const isSentByCurrentUser = msg?.sender?._id === currentUser.id;
            return (
              <div
                key={index}
                className={`mb-4 flex ${
                  isSentByCurrentUser ? "justify-end" : "justify-start"
                }`}
                onClick={() => handleMessageClick(msg)}
              >
                <div className="relative max-w-xs p-2 rounded-lg">
                  <div
                    className={`p-2 rounded-lg border-2 border-gray-700 shadow ${
                      isSentByCurrentUser
                        ? "bg-green-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {msg?.content}
                  </div>
                  {selectedMessage === msg._id && isSentByCurrentUser && (
                    <div className="absolute right-0 top-0 mt-8 bg-white border shadow-lg p-2 rounded-lg z-10">
                      <button
                        onClick={() => handleEditMessage(msg)}
                        className="block p-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="block p-2 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">No messages found.</div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-300 flex items-center bg-gray-100 relative">
        <button
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className="p-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
        >
          😊
        </button>
        {isEmojiPickerOpen && (
          <div className="absolute bottom-16 left-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type a message"
        />
        <input
          type="file"
          onChange={handleMediaUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="p-2 bg-gray-200 cursor-pointer hover:bg-gray-300"
        >
          📎
        </label>
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
