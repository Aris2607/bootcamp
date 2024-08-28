import React from "react";

export default function AdminModal({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black opacity-50 ${
          isOpen ? "transition-opacity duration-300" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-5 transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sign in to our platform
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="py-4"></div>
      </div>
    </div>
  );
}
