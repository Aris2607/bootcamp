// ./src/components/AttendanceOverview.jsx
import React, { useState } from "react";
import PieChart from "../PieChart";

const AttendanceOverview = () => {
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

  const now = new Date(); // Tanggal saat ini
  const year = now.getFullYear(); // Tahun saat ini
  const month = now.getMonth(); // Bulan saat ini (dimulai dari 0)

  console.log(month);

  // Membuat tanggal pada bulan berikutnya dengan hari ke-0 (akan menghasilkan hari terakhir dari bulan saat ini)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  console.log("DIM:", daysInMonth);
  return (
    <div className="bg-second p-6 rounded-2xl mt-4">
      <h2 className="text-lg text-white font-bold mb-4">Attendance Overview</h2>
      <div className="flex justify-between">
        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2 bg-fourth px-8 py-6 w-3/4 rounded-2xl">
          {[...Array(daysInMonth).keys()].map((day) => (
            <div
              onClick={() => handleDayClick(day + 1)}
              key={day}
              className={`w-14 h-8 flex items-center justify-center ${
                [1, 11, 16, 26].includes(day + 1)
                  ? "bg-second text-white"
                  : "bg-gray-300"
              } ${clickedDays.has(day + 1) ? "bg-slate-800" : ""} rounded-full`}
            >
              {day + 1}
            </div>
          ))}
        </div>
        {/* Pie Chart */}
        <div className="flex flex-col mb-4 items-center h-60">
          <PieChart />
          <p className="text-xl text-white">86% attendance</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
