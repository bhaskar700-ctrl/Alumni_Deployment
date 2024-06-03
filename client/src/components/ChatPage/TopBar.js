import React from "react";

function TopBar({ chattingUser }) {
  return (
    <div className="border-gray-300 flex items-center justify-between">
      <span className="text-xl font-bold">
        {chattingUser?.personalDetails?.firstName}{" "}
        {chattingUser?.personalDetails?.lastName}
      </span>
    </div>
  );
}

export default TopBar;
