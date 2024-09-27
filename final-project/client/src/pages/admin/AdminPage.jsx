// import React from "react";

import AttendanceReport from "../../components/admin/AttendanceReport";
import AdminNav from "../../components/navbars/AdminNav";
import AttendanceStatus from "../../components/admin/AttendanceStatus";
import AttendanceTable from "../../components/admin/AttendanceTable";
import { useEffect } from "react";
import { showToastAlertWithCustomAnimation } from "../../utils/alert";
import { useSelector } from "react-redux";

export default function AdminPage() {
  const { user } = useSelector((state) => state.auth);
  const { permit } = useSelector((state) => state.permit);

  useEffect(() => {
    const showToast = localStorage.getItem("showLoginSuccessToast");

    if (showToast === "true") {
      showToastAlertWithCustomAnimation(
        "Login Successful",
        "success",
        `Welcome ${user.Employee.first_name} ${user.Employee.last_name}`
      );
    }

    localStorage.removeItem("showLoginSuccessToast");
  }, []);

  console.log("PERMIT REDUX:", permit);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white pt-[80px] pb-1">
      <AdminNav title={"ADMIN DASHBOARD"} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceStatus />
        <AttendanceReport />
      </div>
      <AttendanceTable />
    </div>
  );
}
