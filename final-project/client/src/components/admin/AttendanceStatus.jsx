import React from "react";

export default function AttendanceStatus() {
  return (
    <div className="bg-white ml-3 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        TODAY&apos;S ATTENDANCE STATUS
      </h2>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="4"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#4ade80"
              strokeWidth="4"
              strokeDasharray="100, 100"
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">150</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-around">
        <div className="text-gray-700">Absent: 79</div>
        <div className="text-gray-700">Present: 30</div>
        <div className="text-gray-700">WFH: 31</div>
      </div>
    </div>
  );
}
