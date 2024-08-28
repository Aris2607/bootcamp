/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";

export default function SuperAdminNav() {
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold text-gray-700">DASHBOARD</div>
        <div className="text-xl font-semibold text-gray-700">
          EMPLOYEES LIST
        </div>
        <div className="text-xl font-semibold text-gray-700">LEAVES</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-gray-600">
          {new Date()
            .toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/\s(?=\d)/, ", ")}
        </div>
        <div className="text-gray-600">Admin</div>
        <button className="p-2 bg-gray-200 rounded-full">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
