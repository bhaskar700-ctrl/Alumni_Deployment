import React from "react";

function MessageItem({
  msg,
  isSentByCurrentUser,
  selectedMessage,
  handleMessageClick,
  handleEditMessage,
  handleDeleteMessage,
}) {
  const mediaBaseUrl = process.env.REACT_APP_BACKEND_URL; // Base URL for media files

  return (
    <div
      className={`mb-4 flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      }`}
      onClick={() => handleMessageClick(msg)}
    >
      <div className="relative max-w-xs p-2 rounded-lg">
        <div
          className={`p-2 rounded-lg border-2 border-gray-700 shadow ${
            isSentByCurrentUser ? "bg-green-500 text-white" : "bg-white text-black"
          }`}
        >
          {msg?.content}
          {msg?.mediaUrl && (
            <div className="mt-2">
              {msg.mediaUrl.endsWith(".mp4") || msg.mediaUrl.endsWith(".mpeg") ? (
                <video
                  src={`${mediaBaseUrl}${msg.mediaUrl}`}
                  controls
                  className="w-full max-h-64 rounded-lg"
                />
              ) : (
                <img
                  src={`${mediaBaseUrl}${msg.mediaUrl}`}
                  alt="Media"
                  className="w-full max-h-64 rounded-lg"
                />
              )}
            </div>
          )}
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
}

export default MessageItem;
