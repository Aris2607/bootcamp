import React from "react";
import { createData } from "../../services/Api";

const LeaveCard = ({
  id,
  name,
  designation,
  leaveType,
  reason,
  duration,
  leaveTypeDetail,
  manager,
  buttonText,
  onStatusChange,
  showActionButtons = true, // Default to true if not provided
  status,
}) => {
  const handleLeave = async (status) => {
    try {
      await createData(`/employee/${id}/leave/response`, { status });
      onStatusChange(id, status); // Call the callback with leave ID and new status
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border rounded-lg shadow p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-semibold text-lg">
            {name} - <span className="text-gray-500">{designation}</span>
          </h4>
        </div>
        <div
          className={`px-2 py-1 rounded text-sm font-medium ${
            leaveType === "Leave"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {leaveType}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{reason}</p>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Applied Duration:</span> {duration}
      </div>
      {leaveTypeDetail && (
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">
            {leaveType === "Leave" ? "Type of Leave:" : "Availability Time:"}
          </span>{" "}
          {leaveTypeDetail}
        </div>
      )}
      {manager && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">Project Manager:</span> {manager}
        </div>
      )}
      {showActionButtons && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => handleLeave("Approved")}
            className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
          >
            {buttonText}
          </button>
          {leaveType === "Leave" && (
            <button
              onClick={() => handleLeave("Rejected")}
              className="bg-gray-200 text-gray-700 py-1 px-4 rounded hover:bg-gray-300"
            >
              Reject
            </button>
          )}
        </div>
      )}
      {status && (
        <div className="flex justify-end">
          <p
            className={
              status == "Approved"
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {status}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
