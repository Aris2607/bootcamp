import React from "react";

export default function AttendanceReport() {
  return (
    <div className="bg-white mr-3 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        YEARLY ATTENDANCE REPORT
      </h2>
      <div className="relative h-40">
        <div className="flex items-end justify-between h-full space-x-1">
          <div className="bg-gray-200 h-1/4 w-4"></div>
          <div className="bg-gray-200 h-3/4 w-4"></div>
          <div className="bg-gray-200 h-2/4 w-4"></div>
          <div className="bg-gray-200 h-full w-4"></div>
          <div className="bg-gray-200 h-1/2 w-4"></div>
          <div className="bg-gray-200 h-1/4 w-4"></div>
          <div className="bg-gray-200 h-3/4 w-4"></div>
          <div className="bg-gray-200 h-2/4 w-4"></div>
          <div className="bg-gray-200 h-full w-4"></div>
          <div className="bg-gray-200 h-1/2 w-4"></div>
        </div>
      </div>
    </div>
  );
}
