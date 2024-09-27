import React from "react";

const NotificationModal = ({ isOpen, onRequestClose, notification }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onRequestClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md mx-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onRequestClose}
        >
          &times;
        </button>

        {/* Notification Title */}
        <h2 className="text-xl font-semibold mb-2">
          {notification?.title || "Notification"}
        </h2>

        {/* Notification Message */}
        <p className="mb-4">
          {notification?.message || "No message provided."}
        </p>

        {/* Date */}
        <p className="text-sm text-gray-500 mb-4">
          {notification?.createdAt
            ? new Date(notification?.createdAt).toLocaleDateString("id-ID")
            : "No date available"}
        </p>
      </div>
    </div>
  );
};

export default NotificationModal;
