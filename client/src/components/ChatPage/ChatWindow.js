import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  sendMessage,
  markMessageAsRead,
  editMessage,
  deleteMessage,
} from "../../redux/store/chattingSlice";
import { io } from "socket.io-client";
import TopBar from "./TopBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import SearchBar from "./SearchBar";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function ChatWindow({ conversation, currentUser }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chatting.conversations);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
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
      dispatch(editMessage.fulfilled(editedMessage)); // Ensure the message is updated in the state
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
    if (message.trim() !== "" || file) {
      const formData = new FormData();
      formData.append("content", message);
      formData.append("receiverId", conversation._id);
      formData.append("senderId", currentUser.id);
      if (file) {
        formData.append("file", file);
      }

      socket.emit("message:sendMessage", formData);
      dispatch(sendMessage(formData));
      setMessage("");
      setFile(null);
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }
    setIsEmojiPickerOpen(false);
  };

  const handleMediaUpload = (file) => {
    setFile(file);
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
      <TopBar chattingUser={chattingUser} />

      <div
        className="flex-grow p-4 overflow-y-scroll"
        ref={messageContainerRef}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url("https://www.collegebatch.com/static/clg-gallery/tezpur-university-tezpur-256627.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Messages */}
        <MessageList
          messages={filteredMessages}
          currentUser={currentUser}
          selectedMessage={selectedMessage}
          handleMessageClick={handleMessageClick}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
        />
      </div>

      {/* Message Input */}
      <MessageInput
        handleSendMessage={handleSendMessage}
        message={message}
        setMessage={setMessage}
        setFile={setFile}
        isEmojiPickerOpen={isEmojiPickerOpen}
        setIsEmojiPickerOpen={setIsEmojiPickerOpen}
        handleEmojiClick={handleEmojiClick}
      />
    </div>
  );
}

export default ChatWindow;
