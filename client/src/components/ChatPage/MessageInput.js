import React, { useState } from "react";
import EmojiPickerComponent from "./EmojiPicker";
import PhotoUpload from "./PhotoUpload";
import VideoUpload from "./VideoUpload";

function MessageInput({
  handleSendMessage,
  message,
  setMessage,
  setFile,
  isEmojiPickerOpen,
  setIsEmojiPickerOpen,
  handleEmojiClick,
}) {
  return (
    <div className="p-4 border-t border-gray-300 flex items-center bg-gray-100 relative">
      <button
        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        className="p-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
      >
        😊
      </button>
      {isEmojiPickerOpen && (
        <EmojiPickerComponent handleEmojiClick={handleEmojiClick} />
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-l-lg"
        placeholder="Type a message"
      />
      <PhotoUpload onPhotoChange={setFile} />
      <VideoUpload onVideoChange={setFile} />
      <button
        onClick={handleSendMessage}
        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
