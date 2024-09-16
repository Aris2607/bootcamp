import React from "react";

const ChannelBar = () => {
  return (
    <div className="w-40 bg-gray-800 text-white flex flex-col space-y-2 p-4 hidden md:block">
      <h2 className="text-lg font-bold mb-4">Channels</h2>
      <div className="flex flex-col space-y-1">
        <div className="hover:bg-gray-700 p-2 rounded cursor-pointer">Chat</div>
      </div>
    </div>
  );
};

export default ChannelBar;
