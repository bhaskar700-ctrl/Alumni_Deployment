import React from "react";
import EmojiPicker from "emoji-picker-react";

function EmojiPickerComponent({ handleEmojiClick }) {
  return (
    <div className="absolute bottom-16 left-0 z-10">
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  );
}

export default EmojiPickerComponent;
