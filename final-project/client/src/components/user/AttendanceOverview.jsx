/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PieChart from "../PieChart";

const AttendanceOverview = ({ attendances }) => {
  const [clickedDays, setClickedDays] = useState(new Set());

  const handleDayClick = (day) => {
    setClickedDays((prev) => {
      const newClickedDays = new Set(prev);
      if (newClickedDays.has(day)) {
        newClickedDays.delete(day);
      } else {
        newClickedDays.add(day);
      }
      return newClickedDays;
    });
  };

  const now = new Date(); // Current date
  const year = now.getFullYear(); // Current year
  const month = now.getMonth(); // Current month (starts from 0)

  // Get the last day of the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Weekday names
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper function to check if the day is Saturday or Sunday
  const isWeekend = (day) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <div className="bg-blue-600 shadow-lg px-12 py-2 rounded-2xl mt-4 dark:bg-slate-700">
      <h2 className="text-lg text-white font-bold mb-4">Attendance Overview</h2>
      <div className="flex justify-between">
        {/* Calendar */}
        <div className="w-3/4">
          {/* Weekday names */}
          <div className="grid grid-cols-7 w-[80%] gap-2 px-8 py-2">
            {weekdays.map((weekday) => (
              <div
                key={weekday}
                className="w-14 h-8 flex items-center justify-center font-bold text-white"
              >
                {weekday}
              </div>
            ))}
          </div>

          {/* Days in the month */}
          <div className="grid grid-cols-7 w-[80%] gap-2 bg-slate-100 dark:bg-slate-500 px-8 py-6 rounded-2xl">
            {[...Array(daysInMonth).keys()].map((day) => (
              <div
                onClick={() => handleDayClick(day + 1)}
                key={day}
                className={`w-14 h-14 flex border-2 rounded-full items-center justify-center ${
                  [1, 11, 16, 26].includes(day + 1)
                    ? "bg-second text-white"
                    : "bg-gray-300"
                } ${clickedDays.has(day + 1) ? "bg-slate-800" : ""} ${
                  isWeekend(day + 1)
                    ? "bg-red-500 dark:bg-red-600 text-white"
                    : "" // Highlight weekends with pink background
                } rounded-full cursor-pointer`}
              >
                {day + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex flex-col mb-4 items-center w-[275px] h-[275px] ">
          <PieChart
            absent={
              attendances && attendances.length > 0
                ? attendances.filter(
                    (attendance) => attendance.status === "Absent"
                  ).length
                : 0
            }
            present={
              attendances && attendances.length > 0
                ? attendances.filter(
                    (attendance) =>
                      attendance.status === "On Time" ||
                      attendance.status === "Late"
                  ).length
                : 1
            }
          />
          <p className="text-xl text-white">
            {attendances && attendances.length > 0
              ? Math.floor(
                  (attendances.filter(
                    (attendance) =>
                      attendance.status === "On Time" ||
                      attendance.status === "Late"
                  ).length /
                    attendances.length) *
                    100
                )
              : "0"}
            {"%"} attendance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
