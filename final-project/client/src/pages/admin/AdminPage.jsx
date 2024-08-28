// import React from "react";

import AttendanceReport from "../../components/admin/AttendanceReport";
import AdminNav from "../../components/navbars/AdminNav";
import AttendanceStatus from "../../components/admin/AttendanceStatus";
import AttendanceTable from "../../components/admin/AttendanceTable";

export default function AdminPage() {
  return (
    <div>
      <AdminNav />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AttendanceStatus />
        <AttendanceReport />
      </div>
      <AttendanceTable />
    </div>
  );
}
