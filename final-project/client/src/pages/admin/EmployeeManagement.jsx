import React from "react";
import AdminNav from "../../components/navbars/AdminNav";

export default function EmployeeManagement() {
  return (
    <div>
      <AdminNav />
      <button className="px-3 py-2 bg-sky-400 ml-2 mt-2 rounded-full">
        Add New Schedule
      </button>
      <button className="px-3 py-2 bg-sky-400 ml-2 mt-2 rounded-full">
        Send Notification
      </button>
    </div>
  );
}
