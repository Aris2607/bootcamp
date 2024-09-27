import React from "react";
import AdminNav from "../../components/navbars/AdminNav";
import Map from "../../components/Map";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-screen">
      <AdminNav title={"ADMIN DASHBOARD"} />

      <main className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Add New Schedule
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Export Schedules
            </button>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Employee Schedules</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Start Time</th>
                  <th className="py-2 px-4 border-b">End Time</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through employee schedules here */}
                <tr>
                  <td className="py-2 px-4 border-b">John Doe</td>
                  <td className="py-2 px-4 border-b">Developer</td>
                  <td className="py-2 px-4 border-b">IT</td>
                  <td className="py-2 px-4 border-b">2024-09-18</td>
                  <td className="py-2 px-4 border-b">09:00 AM</td>
                  <td className="py-2 px-4 border-b">05:00 PM</td>
                  <td className="py-2 px-4 border-b">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Office Location</h2>
          <div className="mb-4">
            <div className="w-full h-96 bg-gray-300 rounded-lg overflow-hidden">
              <Map apiKey="VU2xMNT7KaSvOViW64WSotTqYf17YT-AwH6vcL8wAiI" />
            </div>
          </div>
          <div>
            <p className="font-semibold">Selected Location:</p>
            <p>Latitude: {/* Display latitude here */}</p>
            <p>Longitude: {/* Display longitude here */}</p>
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Update Location
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 ARS Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
