import React from "react";
import MessageItem from "./MessageItem";

function MessageList({
  messages,
  currentUser,
  selectedMessage,
  handleMessageClick,
  handleEditMessage,
  handleDeleteMessage,
}) {
  return (
    <>
      {messages.length ? (
        messages.map((msg, index) => {
          const isSentByCurrentUser = msg?.sender?._id === currentUser.id;
          return (
            <MessageItem
              key={index}
              msg={msg}
              isSentByCurrentUser={isSentByCurrentUser}
              selectedMessage={selectedMessage}
              handleMessageClick={handleMessageClick}
              handleEditMessage={handleEditMessage}
              handleDeleteMessage={handleDeleteMessage}
            />
          );
        })
      ) : (
        <div className="text-center text-gray-500">No messages found.</div>
      )}
    </>
  );
}

export default MessageList;
