import React from "react";

const Sidebar = () => {
  return (
    <div className="w-16 bg-gray-900 h-full flex flex-col items-center space-y-2 py-4">
      {/* Example server icons */}
      <div className="w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500"></div>
      <div className="w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500"></div>
      <div className="w-12 h-12 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500"></div>
    </div>
  );
};

export default Sidebar;
