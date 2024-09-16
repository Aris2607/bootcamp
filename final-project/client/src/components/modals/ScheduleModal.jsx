import React, { useState } from "react";
import { createData } from "../../services/Api"; // Assuming you have this function for API calls

export default function ScheduleModal({ setIsLoading, isOpen, onClose }) {
  const [day, setDay] = useState(""); // Day of the week
  const [startTime, setStartTime] = useState(""); // Start time
  const [endTime, setEndTime] = useState(""); // End time
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const scheduleData = {
        day,
        start_time: startTime,
        end_time: endTime,
      };

      const response = await createData("/schedule", scheduleData); // API endpoint to add schedule
      console.log("Schedule created:", response);

      clearFields();
      onClose();
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError(err.errors || ["An error occurred"]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFields = () => {
    setDay("");
    setStartTime("");
    setEndTime("");
  };

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
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add New Schedule
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
        <div className="py-4">
          <form onSubmit={handleSubmit}>
            <ul
              className={
                error
                  ? "bg-red-400 text-white max-w-fit px-2 py-1 rounded-md"
                  : ""
              }
            >
              {error && error.map((err, i) => <li key={i}>{err.msg}</li>)}
            </ul>
            <div className="block mt-2">
              <label htmlFor="day" className="text-xl">
                Day of the Week
              </label>
              <select
                id="day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                required
              >
                <option value="">-- Select Day --</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="block mt-2">
              <label htmlFor="start_time" className="text-xl">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                required
              />
            </div>
            <div className="block mt-2">
              <label htmlFor="end_time" className="text-xl">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="py-1 px-1 w-full bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:shadow-md focus:shadow-cyan-100 text-md"
                required
              />
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white text-xl rounded-md hover:bg-cyan-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
