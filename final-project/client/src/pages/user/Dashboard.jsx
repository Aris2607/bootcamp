/* eslint-disable no-unused-vars */
import React from "react";
import Calendar from "react-calendar";
import LogoutButton from "../../components/LogoutButton";
import { createData } from "../../services/Api";

const Dashboard = () => {
  const handleAttendance = async () => {
    try {
      const response = await createData("/attendance");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <div className="text-xl font-bold">ARS Attendance</div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">12 July, 2020</div>
          <div className="flex items-center space-x-2">
            <span>Aris</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="rounded-full w-10 h-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mark Attendance */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
          <p className="text-sm text-gray-600">
            {new Date()
              .toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .replace(/\s(?=\d)/, ", ")}
          </p>
          <div className="my-4">
            <input
              type="time"
              className="border rounded p-2 w-full mb-2"
              placeholder="Time In"
            />
            <input
              type="time"
              className="border rounded p-2 w-full"
              placeholder="Time Out"
            />
          </div>
          <button
            onClick={handleAttendance}
            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 w-full"
          >
            Mark Attendance
          </button>
          <p className="text-xs text-center text-teal-500 mt-2 cursor-pointer">
            Notify for work from home
          </p>
        </div>

        {/* Progress Report */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Progress Report</h3>
          {/* Example Progress Chart */}
          <div className="flex items-end space-x-2 justify-center h-32">
            <div className="bg-teal-500 w-6 h-24"></div>
            <div className="bg-teal-300 w-6 h-16"></div>
            <div className="bg-teal-300 w-6 h-20"></div>
            <div className="bg-teal-500 w-6 h-28"></div>
          </div>
          <div className="text-center mt-2">
            <button className="bg-gray-200 py-1 px-3 rounded">Weekly</button>
            <button className="py-1 px-3">Monthly</button>
          </div>
        </div>

        {/* Leaves Detail */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Leaves Detail</h3>
          {/* Example Calendar */}
          <div className="flex justify-between">
            <p>June 2019</p>
            <button className="bg-teal-500 text-white py-1 px-2 rounded">
              Apply for Leave
            </button>
          </div>
          <div className="text-center mt-4">3 Leaves</div>
          {/* More calendar details could be added here */}
          <Calendar />
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white p-4 mt-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Day</th>
              <th className="py-2">Time In</th>
              <th className="py-2">Time Out</th>
              <th className="py-2">Hours Spent</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">01 July</td>
              <td className="py-2">Monday</td>
              <td className="py-2">09:10 am</td>
              <td className="py-2">06:10 pm</td>
              <td className="py-2">07</td>
            </tr>
            {/* More rows can be added here */}
          </tbody>
        </table>
      </div>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
